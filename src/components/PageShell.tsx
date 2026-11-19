import Link from 'next/link';
import type { ReactNode } from 'react';

const links = [
  ['Home', '/'],
  ['Dashboard', '/dashboard'],
  ['Mood check-in', '/mood'],
  ['Journal', '/journal'],
  ['Insights', '/insights'],
  ['Bestie', '/bestie'],
  ['Help', '/help'],
] as const;

export default function PageShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-wellness-bg text-wellness-navy">
      <header className="border-b border-wellness-lavender/60 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3 font-heading text-xl font-bold text-wellness-navy no-underline">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-wellness-navy text-white">F</span>
            FreeSoul
          </Link>
          <nav aria-label="Main navigation" className="mt-4 flex flex-wrap gap-2">
            {links.map(([label, href]) => <Link key={href} href={href} className="rounded-full px-3 py-2 text-sm font-medium text-wellness-navy/70 transition hover:bg-wellness-lavender/40 hover:text-wellness-navy">{label}</Link>)}
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {children}
      </section>
    </main>
  );
}
