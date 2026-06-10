import { ArrowRight, ArrowDown } from 'lucide-react';
import { Reveal } from './useReveal';
import { STATS } from './content';

export default function Hero({ onEnterDemo }) {
  return (
    <section id="hero" className="relative overflow-hidden px-6 pt-20 pb-24 md:pt-28 md:pb-32">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-amber/10 blur-[120px]" />
      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
        <Reveal className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-semibold uppercase tracking-wider">
          UniPreneur Season 4 · PackCo.ai
        </Reveal>
        <Reveal as="h1" delay={60} className="font-outfit text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          Cambodia wants to buy local.<br />
          <span className="bg-gradient-to-r from-amber-light to-amber bg-clip-text text-transparent">Bad packaging is losing the sale.</span>
        </Reveal>
        <Reveal as="p" delay={120} className="max-w-2xl text-base md:text-lg text-slate-light/80 leading-relaxed">
          With imports from across the border dropping sharply, demand is swinging to local food. But shoppers don’t trust local products that look cheap or aren’t compliant — so they switch to other imports. PackCo.ai gives micro food producers retail-ready, Khmer-compliant packaging at a 100-unit minimum.
        </Reveal>
        <Reveal delay={180} className="flex flex-col sm:flex-row gap-3 mt-2">
          <a href="#evidence" className="px-7 py-3.5 rounded-xl bg-gradient-to-tr from-amber to-amber-light text-white font-semibold shadow-lg shadow-amber/20 transition-all flex items-center justify-center gap-2 hover:opacity-95">
            See the evidence <ArrowDown size={18} />
          </a>
          <button onClick={onEnterDemo} className="px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold border border-white/10 transition-all flex items-center justify-center gap-2">
            Launch live demo <ArrowRight size={18} />
          </button>
        </Reveal>
        <Reveal delay={260} className="mt-8 glass rounded-2xl px-6 py-5 max-w-md">
          <p className="text-sm text-slate-light/70">
            When packaging is equal, <span className="text-white font-bold">{STATS.localEqual}%</span> choose local. Make it look cheap at the same price and <span className="text-amber-light font-bold">{STATS.importBad}%</span> leave for imports.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
