import Nav from './landing/Nav';
import Hero from './landing/Hero';
import Problem from './landing/Problem';
import Evidence from './landing/Evidence';
import Segment from './landing/Segment';
import Solution from './landing/Solution';
import Model from './landing/Model';
import Roadmap from './landing/Roadmap';
import Impact from './landing/Impact';
import Team from './landing/Team';
import CtaFooter from './landing/CtaFooter';

export default function LandingPage({ onEnterDemo }) {
  return (
    <div className="min-h-screen bg-navy-dark text-slate-light font-sans antialiased">
      <Nav onEnterDemo={onEnterDemo} />
      <Hero onEnterDemo={onEnterDemo} />
      <Problem />
      <Evidence />
      <Segment />
      <Solution />
      <Model />
      <Roadmap />
      <Impact />
      <Team />
      <CtaFooter onEnterDemo={onEnterDemo} />
    </div>
  );
}
