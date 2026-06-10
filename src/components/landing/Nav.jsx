import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { NAV_LINKS } from './content';

export default function Nav({ onEnterDemo }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass border-b border-white/5' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber to-amber-light flex items-center justify-center font-outfit text-white font-extrabold text-lg shadow-lg">P</div>
          <span className="font-outfit text-lg font-bold text-white tracking-tight">PackCo<span className="text-amber">.ai</span></span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <a key={l.href} href={l.href} className="text-sm text-slate-light/70 hover:text-white transition-colors">{l.label}</a>
          ))}
        </div>
        <button onClick={onEnterDemo} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all flex items-center gap-2">
          Launch Demo <ArrowRight size={15} />
        </button>
      </nav>
    </header>
  );
}
