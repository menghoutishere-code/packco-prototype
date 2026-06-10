import { Reveal, useReveal } from './useReveal';
import { useCountUp } from './useCountUp';
import { STATS } from './content';

function StatBig({ value, label }) {
  const [ref, v] = useCountUp(value);
  return (
    <div ref={ref} className="text-center px-4">
      <div className="font-outfit text-5xl md:text-6xl font-extrabold text-white">{v}%</div>
      <p className="mt-2 text-sm text-slate-light/70 leading-snug">{label}</p>
    </div>
  );
}

function SwingBar({ pct, gradient, label, sub }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref}>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm text-slate-light/80">{label}</span>
        <span className="font-outfit font-bold text-white">{pct}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: shown ? `${pct}%` : '0%', background: gradient, transition: 'width 1100ms cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
      <p className="mt-1 text-xs text-slate-light/50">{sub}</p>
    </div>
  );
}

export default function Evidence() {
  return (
    <section id="evidence" className="px-6 py-20 md:py-28 border-t border-white/5 bg-navy/20 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">The evidence</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">We tested it. Packaging decides the sale.</h2>
          <p className="mt-4 max-w-2xl text-slate-light/70 leading-relaxed">A two-scenario test with {STATS.sampleN} consumers isolates packaging from price and taste.</p>
        </Reveal>

        <Reveal delay={80} className="mt-10 glass rounded-2xl p-7 md:p-9 grid md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6">
            <SwingBar pct={STATS.localEqual} gradient="linear-gradient(90deg,#2E8B57,#3CB371)" label="Both in identical premium pouches" sub="choose LOCAL" />
            <SwingBar pct={STATS.localBad} gradient="linear-gradient(90deg,#F59E0B,#D97706)" label="Local in a plain bag (same $1.50)" sub="choose LOCAL — the rest leave for imports" />
          </div>
          <div className="text-center md:text-left">
            <div className="font-outfit text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-amber-light to-amber bg-clip-text text-transparent">{STATS.importBad}%</div>
            <p className="mt-2 text-white font-semibold">defect to imports on packaging alone</p>
            <p className="mt-1 text-sm text-slate-light/60">Same product, same price — only the packaging changed.</p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Reveal className="glass rounded-2xl py-8"><StatBig value={STATS.skip} label="have skipped a local product because of its packaging" /></Reveal>
          <Reveal delay={80} className="glass rounded-2xl py-8"><StatBig value={STATS.wtp} label="would pay 15–60% more for pro, Khmer-labeled packaging" /></Reveal>
          <Reveal delay={160} className="glass rounded-2xl py-8"><StatBig value={STATS.khmer} label="say Khmer labels make them trust a product more" /></Reveal>
        </div>
        <p className="mt-6 text-xs text-slate-light/40">
          Source: PackCo.ai consumer survey · n={STATS.sampleN} (university students, Phnom Penh, Jun 2026). Directional; producer interviews are the next step.
        </p>
      </div>
    </section>
  );
}
