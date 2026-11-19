import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Shield, FileText, Download, CheckCircle2, Lock } from 'lucide-react';
import { sanitizeForAI } from '../lib/privacyFilter';
import { generateWellnessReportPDF } from '../lib/pdfGenerator';
import { WellnessReportData } from '../types';

export default function InsightsPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [personalNote, setPersonalNote] = useState('');

  const sampleReport: WellnessReportData = {
    summary: "The student has reported moderate stress levels over the past 14 days, primarily associated with upcoming examinations and academic deadlines.",
    moodPatterns: "Frequent fluctuation between Calm and Anxious states, with balanced sleep reflections noted on weekends.",
    frequentlyMentionedConcerns: ["Academic pressure regarding midterms", "Occasional sleep difficulties"],
    observedTriggers: ["Examination deadlines", "Overpacked study schedules"],
    positiveCoping: ["15-minute nature walks", "Box breathing exercises"],
    suggestedDiscussionPoints: ["Strategies for managing exam anxiety", "Time-blocking techniques for academic workload"]
  };

  const handleGenerateReport = () => {
    if (!hasConsented) return;
    // Apply privacy filter demonstration
    const sanitizedText = sanitizeForAI("Student John Doe (john@university.edu, 555-123-4567) reported anxiety.");
    console.log("Sanitized payload sent to AI:", sanitizedText);
    setIsGenerated(true);
  };

  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans pb-16">
      <Head>
        <title>AI Insights & Reports — FreeSoul</title>
      </Head>

      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-5xl mx-auto px-6 pt-10 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-wellness-accent mb-2">
            <Shield className="w-4 h-4" />
            <span>Student-Controlled Privacy Architecture</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold">AI Wellness Report</h1>
          <p className="text-sm text-wellness-sageDark mt-1">Synthesize your emotional check-ins and reflections into a professional report for counselor consultation.</p>
        </div>

        {!isGenerated ? (
          <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
            <h3 className="font-heading font-bold text-lg">Consent & Privacy Confirmation</h3>
            <p className="text-sm text-wellness-sageDark leading-relaxed">
              Before generating your AI wellness report, FreeSoul applies automated PII redaction to strip names, emails, and identifiers. Your journal entries remain strictly private and are never shared automatically.
            </p>

            <label className="flex items-start space-x-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-wellness-navy focus:ring-wellness-navy"
              />
              <span className="text-sm font-medium text-wellness-navy">
                I consent to AI synthesis of my selected mood entries and reflections for personal reporting. I understand this report is not a medical diagnosis.
              </span>
            </label>

            <button
              onClick={handleGenerateReport}
              disabled={!hasConsented}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-soft transition-all ${
                hasConsented
                  ? 'bg-wellness-navy text-white hover:bg-wellness-navy/90'
                  : 'bg-wellness-lavender/50 text-wellness-sageDark cursor-not-allowed'
              }`}
            >
              Generate Wellness Report
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Preview Card */}
            <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card space-y-6">
              <div className="flex justify-between items-center border-b border-wellness-lavender pb-4">
                <h3 className="font-heading font-bold text-xl">Wellness Report Summary</h3>
                <button
                  onClick={() => generateWellnessReportPDF(sampleReport, personalNote, 'Alex Student')}
                  className="bg-wellness-navy text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>
              </div>

              <div className="space-y-4 text-sm text-wellness-navy">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Executive Summary</h4>
                  <p className="text-wellness-sageDark">{sampleReport.summary}</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Mood Patterns</h4>
                  <p className="text-wellness-sageDark">{sampleReport.moodPatterns}</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Frequently Mentioned Concerns</h4>
                  <ul className="list-disc list-inside text-wellness-sageDark space-y-1">
                    {sampleReport.frequentlyMentionedConcerns.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-wellness-accent mb-1">Suggested Discussion Points for Counselor</h4>
                  <ul className="list-disc list-inside text-wellness-sageDark space-y-1">
                    {sampleReport.suggestedDiscussionPoints.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                <div className="pt-4 border-t border-wellness-lavender">
                  <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-2">What I want my counselor to know (Personal Note)</label>
                  <textarea
                    rows={3}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="Add your own words for your consultation..."
                    className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}