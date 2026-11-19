import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Shield, ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For hackathon demo convenience, bypass or authenticate directly
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-wellness-bg flex items-center justify-center px-6">
      <Head>
        <title>Sign In — FreeSoul</title>
      </Head>

      <div className="bg-white w-full max-w-md p-10 rounded-3xl border border-wellness-lavender shadow-soft">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-wellness-navy text-white flex items-center justify-center font-bold text-xl mx-auto mb-4">
            F
          </div>
          <h1 className="font-heading font-bold text-2xl text-wellness-navy">Welcome back to FreeSoul</h1>
          <p className="text-xs text-wellness-sageDark mt-1">Your secure mental wellness sanctuary.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-1.5">Student Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-wellness-navy mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-wellness-bg border border-wellness-lavender rounded-xl text-sm focus:outline-none focus:border-wellness-navy"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-wellness-navy text-white py-3.5 rounded-xl font-bold text-sm shadow-soft hover:bg-wellness-navy/90 transition-all flex items-center justify-center space-x-2 mt-6"
          >
            <span>Sign In Securely</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-wellness-lavender/50 text-center">
          <p className="text-xs text-wellness-sageDark flex items-center justify-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>End-to-End Privacy Protected</span>
          </p>
        </div>
      </div>
    </div>
  );
}