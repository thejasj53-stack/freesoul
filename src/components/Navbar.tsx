import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Heart, Shield, Sparkles, BookOpen, Smile, Home, PhoneCall, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenHelp: () => void;
}

export default function Navbar({ onOpenHelp }: NavbarProps) {
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Mood Tracker', path: '/mood', icon: Smile },
    { name: 'My Journal', path: '/journal', icon: BookOpen },
    { name: 'Bestie AI', path: '/bestie', icon: Sparkles },
    { name: 'My Insights', path: '/insights', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 bg-wellness-bg/80 backdrop-blur-md border-b border-wellness-lavender/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-wellness-navy text-wellness-bg flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <span className="font-heading font-bold text-xl text-wellness-navy tracking-tight">FreeSoul</span>
            <span className="block text-[10px] text-wellness-sageDark tracking-wider uppercase font-semibold">Student Wellness</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-white/60 p-1.5 rounded-full border border-wellness-lavender/60 shadow-soft">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-wellness-navy text-white shadow-sm'
                    : 'text-wellness-navy/70 hover:text-wellness-navy hover:bg-wellness-lavender/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-wellness-sage' : 'text-wellness-accent'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: HELP Button & Profile */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenHelp}
            className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all animate-pulse"
          >
            <PhoneCall className="w-4 h-4" />
            <span>HELP</span>
          </button>

          <button
            onClick={() => router.push('/login')}
            className="p-2.5 text-wellness-navy/70 hover:text-wellness-navy hover:bg-wellness-lavender/40 rounded-full transition-colors"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}