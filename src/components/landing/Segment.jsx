import { Reveal } from './useReveal';
import { PRODUCTS } from './content';

export default function Segment() {
  return (
    <section className="px-6 py-20 md:py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">Who we serve</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">One focus: local micro producers</h2>
          <p className="mt-4 text-slate-light/70 leading-relaxed">
            Home-based food makers — often women-led, 1–4 people, selling 100–500 units a batch on Facebook and in markets. They make world-class food; they just can’t package it for the shelf.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <span className="px-3 py-1.5 rounded-lg glass text-slate-light/80">1–4 people</span>
            <span className="px-3 py-1.5 rounded-lg glass text-slate-light/80">100–500 units / batch</span>
            <span className="px-3 py-1.5 rounded-lg glass text-slate-light/80">Sells online &amp; in markets</span>
          </div>
        </Reveal>
        <Reveal delay={100} className="grid grid-cols-2 gap-3">
          {PRODUCTS.map(p => (
            <div key={p} className="glass rounded-xl px-4 py-4 text-sm text-white font-medium flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-light shrink-0" /> {p}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
