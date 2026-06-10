/* eslint-disable react-refresh/only-export-components */
import { useEffect, useRef, useState } from 'react';

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Returns [ref, shown] — `shown` flips true once the element scrolls into view.
export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => prefersReduced());

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setShown(true); obs.disconnect(); }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return [ref, shown];
}

// Convenience wrapper: fades + lifts its children in on scroll.
export function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }) {
  const [ref, shown] = useReveal();
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(24px)',
        transition: `opacity 600ms ease ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
