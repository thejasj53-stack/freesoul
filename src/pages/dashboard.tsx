import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HelpModal from '../components/HelpModal';
import { Smile, Sparkles, BookOpen, Shield, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [todaysMood, setTodaysMood] = useState<string | null>(null);

  const moods = ['😊 Happy', '😌 Calm', '⚡ Good', '😐 Neutral', '🌧️ Sad', '😰 Anxious', '🌪️ Stressed', '🤯 Overwhelmed'];

  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans pb-16">
      <Head>
        <title>Dashboard — FreeSoul</title>
      </Head>

      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      <main className="max-w-7xl mx-auto px-6 pt-10 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-wellness-accent bg-wellness-lavender/40 px-3 py-1 rounded-full">Daily Sanctuary</span>
            <h1 className="text-3xl font-heading font-extrabold mt-3 text-wellness-navy">Hey, you're here. That's already a good start.</h1>
            <p className="text-sm text-wellness-sageDark mt-1">Take a breath. You are in total control of your space.</p>
          </div>
          <Link href="/insights" className="mt-6 md:mt-0 bg-wellness-navy text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-soft hover:bg-wellness-navy/90 transition-all flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Generate Wellness Report</span>
          </Link>
        </div>

        {/* Quick Check-in Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Mood Check-in Card */}
          <div className="bg-white p-6 rounded-3xl border border-wellness-lavender/60 shadow-card md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">How are you feeling right now?</h3>
              <span className="text-xs text-wellness-sageDark">Daily Check-in</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setTodaysMood(m)}
                  className={`p-3 rounded-2xl text-sm font-medium border transition-all text-center ${
                    todaysMood === m
                      ? 'bg-wellness-navy text-white border-wellness-navy shadow-sm'
                      : 'bg-wellness-bg border-wellness-lavendertag hover:border-wellness-accent text-wellness-navy'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {todaysMood && (
              <div className="mt-4 p-3 bg-wellness-lavender/30 rounded-2xl text-xs text-wellness-navy font-medium flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recorded "{todaysMood}" for today. Keep taking care of yourself.</span>
              </div>
            )}
          </div>

          {/* Bestie AI Quick Card */}
          <div className="bg-wellness-navy text-white p-6 rounded-3xl shadow-card flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-wellness-lavender" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">Talk to Bestie 💗</h3>
              <p className="text-xs text-wellness-lavender/80 leading-relaxed">Feeling overwhelmed with exams or overthinking? Bestie is here to listen without judgment.</p>
            </div>
            <Link href="/bestie" className="mt-6 w-full bg-white text-wellness-navy py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-center block shadow-sm hover:bg-wellness-lavender transition-all">
              Start Conversation
            </Link>
          </div>
        </div>

        {/* Secondary Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-wellness-lavender/60 shadow-card flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-base mb-1">Private Journaling</h4>
              <p className="text-xs text-wellness-sageDark">Write your thoughts. Private by default.</p>
            </div>
            <Link href="/journal" className="p-3 bg-wellness-bg hover:bg-wellness-lavender/40 rounded-2xl text-wellness-navy transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-wellness-lavender/60 shadow-card flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-base mb-1">Mood Analytics & Trends</h4>
              <p className="text-xs text-wellness-sageDark">Review your emotional patterns over time.</p>
            </div>
            <Link href="/mood" className="p-3 bg-wellness-bg hover:bg-wellness-lavender/40 rounded-2xl text-wellness-navy transition-colors">
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}