import { ArrowRight } from 'lucide-react';
import { Reveal } from './useReveal';
import { PIPELINE } from './content';

export default function Solution() {
  return (
    <section id="solution" className="px-6 py-20 md:py-28 border-t border-white/5 bg-navy/20 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl">
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">The solution</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">PackCo.ai — design, compliance &amp; printing in one place</h2>
          <p className="mt-4 text-slate-light/70 leading-relaxed">
            The only all-in-one tool that gets a maker shelf-ready: type in your product, and AI creates a compliant Khmer label, a brand logo, and a real product mockup — then we connect you to affordable printing at a 100-unit minimum.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PIPELINE.map((s, i) => (
            <Reveal key={s.step} delay={i * 90} className="glass rounded-2xl p-6 flex flex-col gap-4 relative">
              <span className="absolute top-5 right-6 font-outfit text-3xl font-extrabold text-white/10">{s.step}</span>
              <div className="w-11 h-11 rounded-xl bg-amber/10 text-amber-light flex items-center justify-center"><s.icon size={22} /></div>
              <h3 className="font-outfit text-lg font-bold text-white">{s.title}</h3>
              <p className="text-sm text-slate-light/70 leading-relaxed">{s.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-8 flex items-start gap-3 text-sm text-slate-light/80">
          <ArrowRight size={16} className="text-amber-light mt-0.5 shrink-0" />
          <span>Printers only print. Design apps can’t do Khmer compliance. We do all three — at a micro-MOQ no one else serves.</span>
        </Reveal>
      </div>
    </section>
  );
}
