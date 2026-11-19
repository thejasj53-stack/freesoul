import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Lock, Trash2 } from 'lucide-react';
import { JournalEntry } from '../types';
import { localData } from '../lib/localData';

export default function JournalPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEntries(localData.getJournal());
    setIsLoading(false);
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true); setError('');
    const now = new Date().toISOString();
    const data: JournalEntry = { id: crypto.randomUUID(), user_id: 'local', title: title.trim(), content: content.trim(), tags: ['Personal'], is_private: true, created_at: now, updated_at: now };
    try { localData.addJournal(data); }
    catch { setError('Could not save locally. Check available browser storage.'); setIsSaving(false); return; }
    setIsSaving(false);
    setEntries((prev) => [data, ...prev]); setTitle(''); setContent('');
  };

  const handleDelete = async (id: string) => {
    setError('');
    localData.deleteJournal(id);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans pb-16">
      <Head>
        <title>Private Journal — FreeSoul</title>
      </Head>

      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-wellness-accent mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Private & Encrypted by Default</span>
            </div>
            <h1 className="text-3xl font-heading font-extrabold">My Digital Journal</h1>
            <p className="text-sm text-wellness-sageDark mt-1">Write freely. Your entries remain entirely confidential.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* New Entry Form */}
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">New Journal Entry</h3>
            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-1.5">Journal Content</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Express your thoughts without judgment..."
                  className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-wellness-navy text-white py-3.5 rounded-xl font-bold text-sm shadow-soft hover:bg-wellness-navy/90 transition-all"
              >
                {isSaving ? 'Saving…' : 'Save Private Entry'}
              </button>
            </form>
          </div>

          {/* Entries Feed */}
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">Past Entries</h3>
            {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {isLoading && <p className="text-sm text-wellness-sageDark">Loading your entries…</p>}
              {!isLoading && entries.length === 0 && !error && <p className="text-sm text-wellness-sageDark">No journal entries yet. Your private reflections will appear here.</p>}
              {entries.map((entry) => (
                <div key={entry.id} className="p-5 bg-wellness-bg border border-wellness-lavender rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-wellness-navy text-base">{entry.title}</h4>
                    <button onClick={() => handleDelete(entry.id)} className="text-wellness-sageDark hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-wellness-sageDark leading-relaxed">{entry.content}</p>
                  <span className="text-[10px] text-wellness-accent block pt-2">{entry.created_at}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
