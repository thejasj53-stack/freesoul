import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Trash2 } from 'lucide-react';
import { localData } from '../lib/localData';
import { MoodType, MoodEntry } from '../types';
import LiveMoodCapture from '../components/LiveMoodCapture';

export default function MoodPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>('Calm');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEntries(localData.getMoods());
    setIsLoading(false);
  }, []);

  const handleDetectedMood = useCallback((mood: MoodType, reflection: string) => {
    setSelectedMood(mood);
    setNote(reflection);
  }, []);

  const handleSaveMood = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); setError('');
    const score = selectedMood === 'Happy' ? 9 : ['Sad', 'Anxious', 'Overwhelmed', 'Exhausted'].includes(selectedMood) ? 4 : 7;
    const data: MoodEntry = { id: crypto.randomUUID(), user_id: 'local', mood: selectedMood, score, note: note.trim() || undefined, tags: ['Daily Check-in'], created_at: new Date().toISOString() };
    try { localData.addMood(data); }
    catch { setError('Could not save locally. Check available browser storage.'); setIsSaving(false); return; }
    setIsSaving(false);
    setEntries((prev) => [data, ...prev]); setNote('');
  };

  const handleDeleteMood = (id: string) => {
    setError('');
    try {
      localData.deleteMood(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch {
      setError('Could not delete this entry from local storage. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans pb-16">
      <Head>
        <title>Mood Tracker — FreeSoul</title>
      </Head>

      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card">
          <h1 className="text-3xl font-heading font-extrabold">Mood Tracker</h1>
          <p className="text-sm text-wellness-sageDark mt-1">Record your emotional state to understand your patterns over time.</p>
        </div>

        <LiveMoodCapture onMoodDetected={handleDetectedMood} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Log Mood Form */}
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">Log Today's Emotion</h3>
            <form onSubmit={handleSaveMood} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-2">Select Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value as MoodType)}
                  className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm font-medium focus:outline-none focus:border-wellness-navy"
                >
                  {['Happy', 'Calm', 'Good', 'Neutral', 'Sad', 'Anxious', 'Stressed', 'Overwhelmed', 'Angry', 'Exhausted'].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-2">Optional Reflection Note</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What influenced your mood today?"
                  className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-wellness-navy text-white py-3.5 rounded-xl font-bold text-sm shadow-soft hover:bg-wellness-navy/90 transition-all"
              >
                {isSaving ? 'Saving…' : 'Save Mood Entry'}
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">Recent Mood History</h3>
            {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {isLoading && <p className="text-sm text-wellness-sageDark">Loading your entries…</p>}
              {!isLoading && entries.length === 0 && !error && <p className="text-sm text-wellness-sageDark">No mood entries yet. Your check-ins will appear here.</p>}
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 bg-wellness-bg border border-wellness-lavender rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-wellness-navy text-base">{entry.mood}</span>
                    {entry.note && <p className="text-xs text-wellness-sageDark mt-1">{entry.note}</p>}
                    <span className="text-[10px] text-wellness-accent mt-2 block">{entry.created_at}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteMood(entry.id)}
                    className="shrink-0 rounded-lg p-2 text-wellness-sageDark transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
                    aria-label={`Delete ${entry.mood} mood entry`}
                    title="Delete mood entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
