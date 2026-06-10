import { Check, ArrowRight } from 'lucide-react';
import { Reveal } from './useReveal';

function FeeStat({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-outfit text-2xl md:text-3xl font-extrabold text-slate-light/80">{value}</div>
      <p className="mt-1 text-xs text-slate-light/50 leading-snug">{label}</p>
    </div>
  );
}

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
              <span className="flex items-center gap-2"><Check size={16} className="text-amber-light shrink-0" /> $5 one-time AI design — label, logo &amp; 3D mockup</span>
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

        {/* Design-fee pain: normally a separate, expensive bill */}
        <Reveal delay={150} className="mt-6 glass rounded-2xl p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-light/50 mb-6">Normally, the design is a separate bill</p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-7 md:gap-10 items-center">
            <div className="grid grid-cols-3 gap-3">
              <FeeStat value="~$50–90" label="Freelance label design" />
              <FeeStat value="+$10–40" label="3D mockup, billed separately" />
              <FeeStat value="~2 weeks" label="Turnaround" />
            </div>
            <div className="flex justify-center text-amber-light">
              <ArrowRight size={28} className="rotate-90 md:rotate-0" />
            </div>
            <div className="text-center md:text-left">
              <div className="font-outfit text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-amber-light to-amber bg-clip-text text-transparent">$5</div>
              <p className="mt-1.5 text-sm text-white font-semibold leading-snug">PackCo AI — label, logo &amp; mockup, in minutes</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
