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
    <main style={{ minHeight: '100vh', background: '#faf8f5', color: '#1e2530', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: '24px max(24px, calc((100% - 960px) / 2))', background: '#fff', borderBottom: '1px solid #e9e5e1' }}>
        <Link href="/" style={{ color: '#1e2530', fontSize: 22, fontWeight: 700, textDecoration: 'none' }}>FreeSoul</Link>
        <nav aria-label="Main navigation" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, marginTop: 16 }}>
          {links.map(([label, href]) => <Link key={href} href={href} style={{ color: '#625b75', textDecoration: 'none' }}>{label}</Link>)}
        </nav>
      </header>
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: 36, margin: '0 0 16px' }}>{title}</h1>
        {children}
      </section>
    </main>
  );
}
