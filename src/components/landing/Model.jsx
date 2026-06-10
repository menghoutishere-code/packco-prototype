import { Check } from 'lucide-react';
import { Reveal } from './useReveal';

export default function Model() {
  return (
    <section id="model" className="px-6 py-20 md:py-28 border-t border-white/5 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl">
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">Business model</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">Cheaper than what they spend today — and legal</h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Reveal className="glass rounded-2xl p-8 flex flex-col gap-5">
            <div className="flex items-baseline gap-2">
              <span className="font-outfit text-5xl font-extrabold text-white">$25</span>
              <span className="text-slate-light/60">Starter Package</span>
            </div>
            <p className="text-sm text-slate-light/70">A professional, compliant design <span className="text-white">+ 100 retail-ready pouches</span>.</p>
            <div className="flex flex-col gap-2.5 text-sm text-slate-light/80">
              <span className="flex items-center gap-2"><Check size={16} className="text-amber-light shrink-0" /> $5 one-time AI design</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-amber-light shrink-0" /> $0.20 / pouch · 100-unit MOQ</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-amber-light shrink-0" /> Reorders just $20 / 100 — the design’s done</span>
            </div>
          </Reveal>
          <Reveal delay={100} className="rounded-2xl p-8 border border-white/10 flex flex-col gap-5 justify-center">
            <p className="text-xs uppercase tracking-wider text-slate-light/50 font-semibold">Their DIY today</p>
            <div className="font-outfit text-4xl font-extrabold text-slate-light/70 line-through decoration-amber/50">~$26 / 100</div>
            <p className="text-sm text-slate-light/70">A self-made sticker that peels, no moisture barrier, and <span className="text-white">not legal for retail</span>. We beat it on price, quality, and compliance — and shoppers pay 15–60% more for the result.</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
