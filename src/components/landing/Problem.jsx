import { Reveal } from './useReveal';
import { WALLS } from './content';

export default function Problem() {
  return (
    <section id="problem" className="px-6 py-20 md:py-28 border-t border-white/5 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">The problem</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">Four walls keep great local food off the shelf</h2>
          <p className="mt-4 max-w-2xl text-slate-light/70 leading-relaxed">
            A maker can have a delicious product, but the moment a shop checks the label, they’re out. Each wall alone is enough to stop them — together they’re a brick wall.
          </p>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WALLS.map((w, i) => (
            <Reveal key={w.title} delay={i * 80} className="glass rounded-2xl p-6 flex flex-col gap-4 h-full">
              <div className="w-11 h-11 rounded-xl bg-amber/10 text-amber-light flex items-center justify-center"><w.icon size={22} /></div>
              <h3 className="font-outfit text-lg font-bold text-white">{w.title}</h3>
              <p className="text-sm text-slate-light/70 leading-relaxed">{w.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
