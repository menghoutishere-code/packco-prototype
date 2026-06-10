import { Reveal } from './useReveal';
import { PHASES } from './content';

export default function Roadmap() {
  return (
    <section id="roadmap" className="px-6 py-20 md:py-28 border-t border-white/5 bg-navy/20 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl">
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">Roadmap</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">Start focused. Scale into a very large market.</h2>
        </Reveal>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {PHASES.map((p, i) => (
            <Reveal key={p.title} delay={i * 90} className={`rounded-2xl p-6 flex flex-col gap-3 ${i === 0 ? 'glass border border-amber/30' : 'border border-white/10'}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${i === 0 ? 'text-amber-light' : 'text-slate-light/50'}`}>{p.tag}</span>
              <h3 className="font-outfit text-xl font-bold text-white">{p.title}</h3>
              <p className="text-sm text-slate-light/70 leading-relaxed">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
