import React from 'react';
import { ShieldCheck, Package, TrendingUp, Layers, ArrowRight } from 'lucide-react';

export default function LandingPage({ onEnterDemo }) {
  return (
    <div className="min-h-screen flex flex-col bg-navy-dark text-slate-light">
      {/* Navbar */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber to-amber-light flex items-center justify-center font-outfit text-white font-extrabold text-lg shadow-lg">P</div>
          <span className="font-outfit text-xl font-bold text-white tracking-tight">PackCo<span className="text-amber">.ai</span></span>
        </div>
        <button 
          onClick={onEnterDemo} 
          className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 border border-white/10 flex items-center gap-2"
        >
          Enter Demo <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-16 md:py-24 flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-semibold uppercase tracking-wider w-max">
            UniPreneur Season 4 Project
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Unlocking <span className="bg-gradient-to-r from-white to-slate-light bg-clip-text text-transparent">Retail Shelves</span> for Local Snacks
          </h1>
          <p className="text-base md:text-lg text-slate-light/80 max-w-lg leading-relaxed">
            Cambodian micro food processors make world-class snacks, but stay locked out of retail due to high MOQ plate fees and strict Khmer labeling laws. PackCo.ai bypasses the barrier using digital co-op print aggregation and automated compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button 
              onClick={onEnterDemo} 
              className="px-8 py-4 rounded-xl bg-gradient-to-tr from-amber to-amber-light hover:from-amber-light hover:to-amber text-white font-semibold shadow-lg shadow-amber/20 transition-all duration-200 flex items-center justify-center gap-3"
            >
              Launch Operational Demo <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass p-8 rounded-2xl flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-amber/10 text-amber flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-white">Sub-Decree 112 Compliance</h3>
            <p className="text-sm text-slate-light/70 leading-relaxed">
              Automated Khmer ingredients translation and FDA-equivalent nutrition fact calculation mapped to Ministry of Commerce regulations.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Layers size={24} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-white">Demand Aggregation</h3>
            <p className="text-sm text-slate-light/70 leading-relaxed">
              We pool small print orders (e.g. 250 bags each) into standard batch runs of 5,000 to unlock industrial digital printing prices.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <Package size={24} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-white">Low-MOQ Packaging</h3>
            <p className="text-sm text-slate-light/70 leading-relaxed">
              Order custom-printed, high-barrier stand-up pouches with as little as a 100-unit MOQ, bypassing the standard 10,000-unit importer wall.
            </p>
          </div>

          <div className="glass p-8 rounded-2xl flex flex-col gap-4 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-outfit text-lg font-bold text-white">Capture Local Margins</h3>
            <p className="text-sm text-slate-light/70 leading-relaxed">
              Helping local farmers and processors keep value-addition in Cambodia rather than exporting raw ingredients to neighbors.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-xs text-slate-light/50">
        &copy; {new Date().getFullYear()} PackCo.ai. Built for UniPreneur S4.
      </footer>
    </div>
  );
}
