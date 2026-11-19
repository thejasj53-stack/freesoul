import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Shield, Sparkles, BookOpen, Smile, Home, PhoneCall, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenHelp: () => void;
}

export default function Navbar({ onOpenHelp }: NavbarProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Mood Tracker', path: '/mood', icon: Smile },
    { name: 'My Journal', path: '/journal', icon: BookOpen },
    { name: 'Bestie AI', path: '/bestie', icon: Sparkles },
    { name: 'My Insights', path: '/insights', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-wellness-lavender/60 bg-wellness-bg/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-20 flex items-center justify-between gap-3">
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
        <nav aria-label="Main navigation" className="hidden lg:flex items-center space-x-1 bg-white/70 p-1.5 rounded-full border border-wellness-lavender/60 shadow-soft">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
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
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 sm:px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-rose-500"
            aria-label="Open support and help"
          >
            <PhoneCall className="w-4 h-4" />
            <span className="hidden sm:inline">Support</span>
          </button>

          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-full border border-wellness-lavender bg-white p-2.5 text-wellness-navy"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="lg:hidden border-t border-wellness-lavender/60 bg-white px-4 py-3">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-wellness-navy text-white' : 'bg-wellness-bg text-wellness-navy hover:bg-wellness-lavender/50'}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
