import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Shield, Download, Lock } from 'lucide-react';
import { localData } from '../lib/localData';
import { generateWellnessReportPDF } from '../lib/pdfGenerator';
import type { WellnessReportData } from '../types';

export default function InsightsPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [report, setReport] = useState<WellnessReportData | null>(null);
  const [personalNote, setPersonalNote] = useState('');
  const [moodCount, setMoodCount] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMoodCount(localData.getMoods().length);
    setJournalCount(localData.getJournal().length);
  }, []);

  const handleGenerateReport = async () => {
    if (!hasConsented || isGenerating) return;
    const moods = localData.getMoods();
    const journal = localData.getJournal();
    if (!moods.length && !journal.length) {
      setError('There are no saved mood or journal records yet. Add some records first, then return here.');
      return;
    }

    setIsGenerating(true);
    setError('');
    try {
      const response = await fetch('/api/wellness-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moods, journal }),
      });
      const data = await response.json() as { report?: WellnessReportData; error?: string };
      if (!response.ok || !data.report) throw new Error(data.error || 'Could not generate your report. Please try again.');
      setReport(data.report);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not generate your report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const bullets = (items: string[]) => items.length
    ? <ul className="list-disc list-inside text-wellness-sageDark space-y-1">{items.map((item, i) => <li key={`${i}-${item}`}>{item}</li>)}</ul>
    : <p className="text-wellness-sageDark">Your records did not provide enough detail for this section.</p>;

  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans pb-16">
      <Head><title>AI Insights & Reports — FreeSoul</title></Head>
      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-5xl mx-auto px-6 pt-10 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-wellness-accent mb-2"><Shield className="w-4 h-4" /><span>Based on your saved records</span></div>
          <h1 className="text-3xl font-heading font-extrabold">Wellness Report</h1>
          <p className="text-sm text-wellness-sageDark mt-1">Create a reflection from your actual mood check-ins and journal entries.</p>
        </div>

        {!report ? (
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">Your records</h3>
            <p className="text-sm text-wellness-sageDark">Found {moodCount} mood {moodCount === 1 ? 'entry' : 'entries'} and {journalCount} journal {journalCount === 1 ? 'entry' : 'entries'} in this browser. The report will only use these records.</p>
            <div className="rounded-2xl bg-wellness-bg border border-wellness-lavender p-4 text-sm text-wellness-sageDark">
              <div className="flex items-center gap-2 font-bold text-wellness-navy mb-2"><Lock className="w-4 h-4" />Privacy</div>
              <p>Your records are stored locally. If you consent, their text is sent to Groq to generate the report. Common emails, phone numbers, and student ID numbers are redacted first. Avoid including sensitive information you do not want processed.</p>
            </div>
            <label className="flex items-start space-x-3 cursor-pointer pt-2">
              <input type="checkbox" checked={hasConsented} onChange={(e) => setHasConsented(e.target.checked)} className="mt-1 w-4 h-4 rounded text-wellness-navy focus:ring-wellness-navy" />
              <span className="text-sm font-medium text-wellness-navy">I consent to sending my saved mood and journal records, after common identifier redaction, to Groq for this report. I understand it is not a medical diagnosis.</span>
            </label>
            {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
            <button onClick={handleGenerateReport} disabled={!hasConsented || isGenerating} className={`w-full py-4 rounded-2xl font-bold text-sm shadow-soft transition-all ${hasConsented && !isGenerating ? 'bg-wellness-navy text-white hover:bg-wellness-navy/90' : 'bg-wellness-lavender/50 text-wellness-sageDark cursor-not-allowed'}`}>
              {isGenerating ? 'Generating from your records…' : 'Generate My Report'}
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-3 border-b border-wellness-lavender pb-4">
              <div><h3 className="font-heading font-bold text-xl">Your Wellness Report</h3><p className="text-xs text-wellness-sageDark mt-1">Generated from {moodCount} mood entries and {journalCount} journal entries</p></div>
              <button onClick={() => generateWellnessReportPDF(report, personalNote, 'Personal Report')} className="bg-wellness-navy text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm"><Download className="w-4 h-4" /><span>Download PDF</span></button>
            </div>
            <section><h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Summary</h4><p className="text-sm text-wellness-sageDark">{report.summary}</p></section>
            <section><h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Mood Patterns</h4><p className="text-sm text-wellness-sageDark">{report.moodPatterns}</p></section>
            <section><h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Concerns in Your Records</h4>{bullets(report.frequentlyMentionedConcerns)}</section>
            <section><h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Possible Triggers Mentioned</h4>{bullets(report.observedTriggers)}</section>
            <section><h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Coping Approaches You Mentioned</h4>{bullets(report.positiveCoping)}</section>
            <section><h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Discussion Points</h4>{bullets(report.suggestedDiscussionPoints)}</section>
            <section className="pt-4 border-t border-wellness-lavender">
              <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-2">What I want my counselor to know</label>
              <textarea rows={3} value={personalNote} onChange={(e) => setPersonalNote(e.target.value)} placeholder="Add your own words for your consultation..." className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy" />
            </section>
            <button onClick={() => { setReport(null); setError(''); }} className="text-sm font-semibold text-wellness-accent hover:underline">Generate again from latest records</button>
          </div>
        )}
      </main>
    </div>
  );
}
