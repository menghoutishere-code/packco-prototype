import { Reveal } from './useReveal';
import { TEAM } from './content';

export default function Team() {
  return (
    <section className="px-6 py-20 md:py-28 border-t border-white/5 bg-navy/20">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl">
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">The team</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">Built by a UniPreneur S4 team</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 80} className="glass rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber to-amber-light flex items-center justify-center font-outfit text-white font-extrabold text-lg">{m.name[0]}</div>
              <h3 className="font-outfit text-lg font-bold text-white">{m.name}</h3>
              <p className="text-sm text-slate-light/70 leading-relaxed">{m.role}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
