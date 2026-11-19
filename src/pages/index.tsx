import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Shield, Sparkles, Heart, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-wellness-bg text-wellness-navy font-sans">
      <Head>
        <title>FreeSoul — Your Mental Wellness Companion</title>
      </Head>

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-wellness-navy text-wellness-bg flex items-center justify-center font-bold text-xl">
            F
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight">FreeSoul</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-sm font-bold text-wellness-navy hover:text-wellness-accent">
            Log In
          </Link>
          <Link href="/dashboard" className="bg-wellness-navy text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-soft hover:bg-wellness-navy/90 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-28 text-center">
        <div className="inline-flex items-center space-x-2 bg-wellness-lavender/60 px-4 py-2 rounded-full text-xs font-bold text-wellness-navy mb-6">
          <Sparkles className="w-3.5 h-3.5 text-wellness-accent" />
          <span>Privacy-First Student Mental Wellness</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight text-wellness-navy leading-tight mb-6">
          Your mind matters.<br />Every single day.
        </h1>
        <p className="text-lg md:text-xl text-wellness-sageDark max-w-2xl mx-auto mb-10">
          A safe, encrypted space to understand your feelings, reflect without judgment, and share structured wellness reports with professionals when you choose.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/dashboard" className="w-full sm:w-auto bg-wellness-navy text-white px-8 py-4 rounded-2xl font-bold text-base shadow-soft hover:bg-wellness-navy/90 transition-all flex items-center justify-center space-x-2">
            <span>Start Your Journey</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto bg-white border border-wellness-lavender text-wellness-navy px-8 py-4 rounded-2xl font-bold text-base shadow-sm hover:bg-wellness-lavender/30 transition-all">
            Explore Demo Dashboard
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-wellness-lavender/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-heading font-bold mb-4">Built for students, secured for privacy.</h2>
          <p className="text-wellness-sageDark">Everything you need to navigate college life with emotional clarity.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Heart,
              title: "Private Digital Journal",
              desc: "Express your thoughts freely. Your journal is encrypted and private by default—never shared without your explicit consent."
            },
            {
              icon: Sparkles,
              title: "Bestie AI Companion",
              desc: "A warm, non-judgmental AI companion available 24/7 to listen, ground you, and guide you through academic stress."
            },
            {
              icon: Shield,
              title: "AI Wellness Reports",
              desc: "Turn your reflections into a structured professional report for your counselor, while you remain in total control of what's shared."
            },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white p-8 rounded-3xl border border-wellness-lavender/60 shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-wellness-lavender/40 text-wellness-navy flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-wellness-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-sm text-wellness-sageDark leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-wellness-navy text-wellness-lavender py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-white text-wellness-navy flex items-center justify-center font-bold">F</div>
            <span className="font-heading font-bold text-lg text-white">FreeSoul</span>
          </div>
          <p className="text-xs text-wellness-lavender/70">© {new Date().getFullYear()} FreeSoul. Designed for student mental wellness. Not a medical diagnosis tool.</p>
        </div>
      </footer>
    </div>
  );
}
