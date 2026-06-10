// Centralized landing-page copy + stats — sourced from Competition-proposed/ (Phase 1, English).
import {
  DollarSign, Boxes, PenTool, Scale,
  ShieldCheck, Sparkles, Box,
  PackageCheck, TrendingUp, ShoppingCart, BadgeCheck,
} from 'lucide-react';

// Consumer survey, n=23 (university students, Phnom Penh, Jun 2026) — the only collected evidence.
export const STATS = {
  localEqual: 96,   // choose local when packaging is equal
  localBad: 52,     // choose local when local looks cheap (same price)
  importBad: 48,    // defect to imports purely on packaging
  skip: 78,         // have skipped a local product over its packaging
  wtp: 65,          // would pay a 15–60% premium for pro Khmer-labeled packaging
  khmer: 91,        // say Khmer labels matter
  sampleN: 23,
};

export const WALLS = [
  { icon: DollarSign, title: 'Cost', text: 'Professional printed packaging is priced for big brands — micro-makers can’t justify it.' },
  { icon: Boxes, title: 'MOQ', text: 'Real printing needs 10,000-unit runs to amortize the plates. A home maker sells 100–500.' },
  { icon: PenTool, title: 'No design', text: 'No designer, no brand identity — just a clear bag and a self-printed sticker that peels.' },
  {
    icon: Scale,
    title: 'Legal compliance',
    text: 'Khmer-language labels are mandatory under Cambodia’s Law on Food Safety (2022) & Standard CS 001-2000; shops reject non-compliant products.',
    source: { label: 'Standard CS 001-2000', url: 'https://www.wipo.int/wipolex/en/legislation/details/6403' },
  },
];

export const PRODUCTS = [
  'Banana / taro chips', 'Beef jerky', 'Dried fish',
  'Sausages', 'Local sweets', 'Fresh noodles',
];

export const PIPELINE = [
  { icon: ShieldCheck, step: '01', title: 'Compliant Khmer label', text: 'AI builds a legally compliant Khmer label — ingredients, nutrition, warnings — in seconds.' },
  { icon: Sparkles, step: '02', title: 'Brand logo', text: 'A clean, original brand mark generated to match the product.' },
  { icon: Box, step: '03', title: '3D product mockup', text: 'The design rendered onto their real package — shelf- and Facebook-ready.' },
];

export const PHASES = [
  { tag: 'Phase 1 · now', title: 'Facilitate', text: 'AI design + a print partner + pooled orders → makers reach the shelf at a 100-unit MOQ.' },
  { tag: 'Phase 2', title: 'Own & certify', text: 'Our own printing, a template library, and a GS1 / MISTI registration service — cheaper, complete.' },
  { tag: 'Phase 3', title: 'Customize & scale', text: 'Full custom branding; move up-market to enterprises and new markets.' },
];

export const MAKER_IMPACT = [
  { icon: DollarSign, text: 'Lower cost than their DIY sticker today' },
  { icon: ShoppingCart, text: 'Finally gets onto minimart & supermarket shelves' },
  { icon: TrendingUp, text: 'Higher price & income — shoppers pay more for it' },
  { icon: BadgeCheck, text: 'Legally compliant, retail-ready packaging' },
];

export const NATION_IMPACT = [
  { icon: PackageCheck, text: 'Local brands win back demand from imports' },
  { icon: TrendingUp, text: 'Value-addition stays in the local economy' },
  { icon: BadgeCheck, text: 'Equal opportunity for the smallest makers' },
];

export const TEAM = [
  { name: 'Hout', role: 'Product & AI — builds the compliance + design engine and the live demo.' },
  { name: 'Vanna', role: 'Business model & market — unit economics, competition, go-to-market.' },
  { name: 'Votey', role: 'Product vision & roadmap — sustainability and the path to scale.' },
];

export const NAV_LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#evidence', label: 'Evidence' },
  { href: '#solution', label: 'Solution' },
  { href: '#model', label: 'Model' },
  { href: '#roadmap', label: 'Roadmap' },
];
