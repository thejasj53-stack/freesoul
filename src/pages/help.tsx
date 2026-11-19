import PageShell from '../components/PageShell';
import Link from 'next/link';
import { ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function Help() {
  return (
    <PageShell title="Help and support">
      <p className="mt-3 max-w-2xl text-base leading-7 text-wellness-sageDark">
        A little guidance for using FreeSoul, with clear paths to support when you need it.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="rounded-3xl border border-wellness-lavender/70 bg-white p-6 shadow-card">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-wellness-lavender/50 text-wellness-accent"><ShieldCheck className="h-5 w-5" /></div>
          <h2 className="font-heading text-lg font-bold">Your privacy comes first</h2>
          <p className="mt-2 text-sm leading-6 text-wellness-sageDark">Your journal stays private by default. You choose when to create a report and what to share.</p>
        </article>
        <article className="rounded-3xl border border-wellness-lavender/70 bg-white p-6 shadow-card">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-rose-50 text-rose-600"><HeartHandshake className="h-5 w-5" /></div>
          <h2 className="font-heading text-lg font-bold">Need support now?</h2>
          <p className="mt-2 text-sm leading-6 text-wellness-sageDark">Open the support hub for grounding exercises and crisis resources. If you are in immediate danger, contact local emergency services.</p>
        </article>
      </div>
      <div className="mt-8 rounded-3xl bg-wellness-navy p-6 text-white sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-heading text-xl font-bold">Ready for your next check-in?</h2>
          <p className="mt-1 text-sm text-wellness-lavender/80">Your dashboard brings your daily tools together.</p>
        </div>
        <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-wellness-navy transition hover:bg-wellness-lavender sm:mt-0">
          Go to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <p className="mt-6 text-xs leading-5 text-wellness-sageDark">FreeSoul is a personal reflection tool. It does not provide clinical diagnosis or emergency care.</p>
    </PageShell>
  );
}
