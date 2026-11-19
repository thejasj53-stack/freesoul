import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Smile, Calendar, Plus, TrendingUp } from 'lucide-react';
import { MoodType, MoodEntry } from '../types';

export default function MoodPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>('Calm');
  const [note, setNote] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([
    { id: '1', user_id: 'u1', mood: 'Calm', score: 8, note: 'Had a peaceful morning walk.', tags: ['Nature', 'Sleep'], created_at: '2025-05-01' },
    { id: '2', user_id: 'u1', mood: 'Anxious', score: 4, note: 'Upcoming midterm exams.', tags: ['Academics', 'Stress'], created_at: '2025-05-02' },
  ]);

  const handleSaveMood = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      user_id: 'u1',
      mood: selectedMood,
      score: selectedMood === 'Happy' ? 9 : selectedMood === 'Anxious' ? 4 : 6,
      note,
      tags: ['Daily Check-in'],
      created_at: new Date().toISOString().split('T')[0],
    };
    setEntries([newEntry, ...entries]);
    setNote('');
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
                Save Mood Entry
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">Recent Mood History</h3>
            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 bg-wellness-bg border border-wellness-lavender rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-wellness-navy text-base">{entry.mood}</span>
                    {entry.note && <p className="text-xs text-wellness-sageDark mt-1">{entry.note}</p>}
                    <span className="text-[10px] text-wellness-accent mt-2 block">{entry.created_at}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}