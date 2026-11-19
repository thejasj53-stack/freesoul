import React, { useState } from 'react';
import { X, Phone, ShieldAlert, HeartHandshake, ExternalLink, BookOpenCheck } from 'lucide-react';
import BreathingExercise from './BreathingExercise';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'immediate' | 'professionals' | 'resources' | 'breathing'>('immediate');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-wellness-navy/40 backdrop-blur-sm p-4 animate-fadeIn">
      <div role="dialog" aria-modal="true" aria-labelledby="support-title" className="bg-wellness-card w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-wellness-lavender flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-wellness-navy text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 text-red-400 rounded-2xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="support-title" className="text-xl font-heading font-bold">Support & Crisis Resource Center</h2>
              <p className="text-xs text-wellness-lavender/80">You are not alone. Confidential help is available 24/7.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-wellness-lavender"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div role="group" aria-label="Support topics" className="flex overflow-x-auto border-b border-wellness-lavender bg-wellness-bg/50 px-3 sm:px-6 pt-3 gap-1 sm:gap-4">
          {[
            { id: 'immediate', label: 'Immediate Crisis', icon: ShieldAlert },
            { id: 'professionals', label: 'College Counselors', icon: HeartHandshake },
            { id: 'resources', label: 'Resource Library', icon: BookOpenCheck },
            { id: 'breathing', label: 'Calm & Breathe', icon: ExternalLink },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                  aria-pressed={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 pb-3 px-3 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-wellness-navy text-wellness-navy'
                    : 'border-transparent text-wellness-navy/60 hover:text-wellness-navy'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'immediate' && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <h3 className="font-bold text-red-800 text-base mb-1">If you are in immediate physical danger:</h3>
                <p className="text-red-700 text-sm">Please call your local emergency services (e.g., 911 in the US/Canada, 112 in Europe, 999 in the UK) immediately.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-wellness-bg rounded-2xl border border-wellness-lavender">
                  <h4 className="font-bold text-wellness-navy">988 Suicide & Crisis Lifeline</h4>
                  <p className="text-xs text-wellness-sageDark mt-1 mb-3">Free, confidential support available 24/7 for anyone in distress.</p>
                  <a href="tel:988" className="inline-flex items-center space-x-2 bg-wellness-navy text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                    <Phone className="w-4 h-4" />
                    <span>Call or Text 988</span>
                  </a>
                </div>

                <div className="p-5 bg-wellness-bg rounded-2xl border border-wellness-lavender">
                  <h4 className="font-bold text-wellness-navy">The Crisis Text Line</h4>
                  <p className="text-xs text-wellness-sageDark mt-1 mb-3">Connect with a trained crisis counselor via SMS.</p>
                  <a href="sms:741741?body=HOME" className="inline-flex items-center space-x-2 bg-wellness-navy text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                    <Phone className="w-4 h-4" />
                    <span>Text HOME to 741741</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professionals' && (
            <div className="space-y-4">
              <p className="text-sm text-wellness-sageDark">Verified campus and regional mental health professionals available for student consultation:</p>
              
              <div className="space-y-3">
                {[
                  { name: 'Dr. Sarah Jenkins, PsyD', title: 'Lead Campus Psychologist', specialty: 'Anxiety, Academic Stress, ADHD', contact: 's.jenkins@university.edu | Ext: 4321' },
                  { name: 'Marcus Vance, LMFT', title: 'Student Wellness Counselor', specialty: 'Relationship Dynamics, Burnout', contact: 'm.vance@university.edu | Ext: 4322' },
                  { name: 'Dr. Elena Rostova, MD', title: 'Consulting Psychiatrist', specialty: 'Sleep Disorders, Mood Regulation', contact: 'e.rostova@university.edu | Ext: 4323' },
                ].map((prof, i) => (
                  <div key={i} className="p-4 bg-wellness-bg border border-wellness-lavender rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-wellness-navy">{prof.name}</h4>
                      <p className="text-xs text-wellness-accent font-medium">{prof.title} • Specializes in {prof.specialty}</p>
                      <p className="text-xs text-wellness-sageDark mt-1">{prof.contact}</p>
                    </div>
                    <button className="bg-wellness-navy text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-wellness-navy/90">
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'Guided Mindfulness for Exam Stress', duration: '10 min', category: 'Meditation', url: 'https://www.youtube.com/watch?v=ZToicYcHIOU' },
                { title: 'Deep Sleep & Nervous System Reset', duration: '20 min', category: 'Sleep', url: 'https://www.youtube.com/watch?v=aEqlQvczMJQ' },
                { title: 'Overcoming Academic Overwhelm', duration: '15 min', category: 'Coping', url: 'https://www.youtube.com/watch?v=inpok4MKVLM' },
              ].map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-wellness-bg border border-wellness-lavender rounded-2xl hover:border-wellness-accent transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-wellness-lavender/50 text-wellness-navy px-2.5 py-1 rounded-full">{res.category}</span>
                    <span className="text-xs text-wellness-sageDark">{res.duration}</span>
                  </div>
                  <h4 className="font-bold text-wellness-navy group-hover:text-wellness-accent transition-colors">{res.title}</h4>
                </a>
              ))}
            </div>
          )}

          {activeTab === 'breathing' && (
            <BreathingExercise />
          )}
        </div>
      </div>
    </div>
  );
}
