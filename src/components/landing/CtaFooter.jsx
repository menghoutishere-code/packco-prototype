import { ArrowRight } from 'lucide-react';
import { Reveal } from './useReveal';

export default function CtaFooter({ onEnterDemo }) {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-20 md:py-28 border-t border-white/5">
        <div aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber/10 blur-[120px]" />
        <Reveal className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="font-outfit text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
            Cambodia wants to buy local.<br />
            <span className="bg-gradient-to-r from-amber-light to-amber bg-clip-text text-transparent">We make local worth buying.</span>
          </h2>
          <p className="text-slate-light/70 max-w-xl">See the compliance engine, logo studio, and 3D mockups generate a retail-ready package — live.</p>
          <button onClick={onEnterDemo} className="px-8 py-4 rounded-xl bg-gradient-to-tr from-amber to-amber-light text-white font-semibold shadow-lg shadow-amber/20 transition-all flex items-center gap-3 hover:opacity-95">
            Try the live demo <ArrowRight size={18} />
          </button>
        </Reveal>
      </section>
      <footer className="px-6 py-8 border-t border-white/5 text-center text-xs text-slate-light/40">
        © {new Date().getFullYear()} PackCo.ai · Built for UniPreneur Season 4
      </footer>
    </>
  );
}
