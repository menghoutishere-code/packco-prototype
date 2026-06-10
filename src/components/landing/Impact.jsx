import { Reveal } from './useReveal';
import { MAKER_IMPACT, NATION_IMPACT } from './content';

function Col({ title, items, delay }) {
  return (
    <Reveal delay={delay} className="glass rounded-2xl p-7 flex flex-col gap-4">
      <h3 className="font-outfit text-xl font-bold text-white">{title}</h3>
      <div className="flex flex-col gap-3">
        {items.map((it, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-slate-light/80">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-amber/10 text-amber-light flex items-center justify-center"><it.icon size={16} /></div>
            <span className="pt-1.5">{it.text}</span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function Impact() {
  return (
    <section className="px-6 py-20 md:py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <Reveal className="max-w-2xl">
          <span className="text-amber-light text-xs font-bold uppercase tracking-[0.2em]">Impact</span>
          <h2 className="mt-3 font-outfit text-3xl md:text-4xl font-extrabold text-white tracking-tight">A win for the maker — and for Cambodia</h2>
        </Reveal>
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <Col title="For the maker" items={MAKER_IMPACT} delay={0} />
          <Col title="For Cambodia" items={NATION_IMPACT} delay={100} />
        </div>
      </div>
    </section>
  );
}
