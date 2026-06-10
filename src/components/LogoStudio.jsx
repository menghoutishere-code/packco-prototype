import React, { useState } from 'react';
import { Sparkles, Check, RefreshCw, Download, Image as ImageIcon } from 'lucide-react';

export default function LogoStudio({ productName, onApplyLogo }) {
  const [motif, setMotif] = useState('mango'); // 'mango', 'cashew', 'pepper', 'rice', 'leaf', 'beehive'
  const [logoStyle, setLogoStyle] = useState('combination'); // wordmark, lettermark, icon, abstract, mascot, combination, emblem
  const [brandName, setBrandName] = useState(productName || 'Agri Khmer');
  const [estYear, setEstYear] = useState('2026');
  const [primaryColor, setPrimaryColor] = useState('#f59e0b'); // amber-500
  const [secondaryColor, setSecondaryColor] = useState('#1e293b'); // slate-800
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedAssetLogo, setSelectedAssetLogo] = useState(null); // URL of high-res pre-made asset

  // Local SVG motifs
  const getMotifSvg = (type, color) => {
    switch (type) {
      case 'cashew':
        return (
          <path
            fill={color}
            d="M50 35c-8.3 0-15 6.7-15 15 0 3.9 1.5 7.4 4 10.1l-1.3 2.6c-.6 1.2-.4 2.7.7 3.6 1.1.9 2.7.9 3.6-.3l1.8-2.4c1.9.9 4 1.4 6.2 1.4 8.3 0 15-6.7 15-15s-6.7-15-15-15zm-2 22c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"
          />
        );
      case 'pepper':
        return (
          <g fill={color}>
            <circle cx="42" cy="45" r="4" />
            <circle cx="50" cy="40" r="5" />
            <circle cx="58" cy="48" r="4.5" />
            <circle cx="48" cy="55" r="5" />
            <circle cx="58" cy="58" r="3.5" />
            <path d="M42 41c1-4 3-7 6-9s6-3 6-3l-1-2s-4 1-7 4-5 6-5 10z" />
          </g>
        );
      case 'rice':
        return (
          <path
            fill={color}
            d="M45 65s-2-8-2-15c0-6 3-12 8-16 1-1 2-1 2 0s-2 3-4 6c-2 4-3 9-2 13 1-3 3-6 6-8 1-1 2 0 1 1-2 3-3 7-3 10 1-2 3-4 6-6 1-1 2 0 1 1-3 3-4 7-3 11 2-3 4-5 7-6 1 0 1 1 0 2-4 3-5 8-4 12v3h-10z"
          />
        );
      case 'leaf':
        return (
          <path
            fill={color}
            d="M50 30c-11 0-20 9-20 20 0 11 20 25 20 25s20-14 20-25c0-11-9-20-20-20zm0 35c-8.3 0-15-6.7-15-15s6.7-15 15-15v30z"
          />
        );
      case 'beehive':
        return (
          <path
            fill={color}
            d="M50 32l10 6v12l-10 6-10-6V38zm0 24l10 6v12l-10 6-10-6v-12zM33 42l10 6v12l-10 6-10-6V48zm34 0l10 6v12l-10 6-10-6V48z"
          />
        );
      case 'mango':
      default:
        return (
          <g fill={color}>
            <path d="M52 35c-9-1-17 6-17 15 0 11 11 20 15 22 4-2 15-11 15-22 0-9-5-14-13-15z" />
            <path d="M48 33c0-3 2-6 5-8 4-3 9-3 9-3s-2 3-5 6c-3 3-6 5-9 5z" fill="#15803d" />
          </g>
        );
    }
  };

  // Modern logo placeholders — one fitting mark per style (offline fallback / pre-generation preview)
  const generateVectorSvg = () => {
    const motifSvg = renderSvgStringToHtml(getMotifSvg(motif, primaryColor));
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const name = esc((brandName || 'Brand').trim());
    const len = Math.max((brandName || 'Brand').trim().length, 1);
    const initials = esc((brandName || 'Brand').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 3).toUpperCase() || 'P');
    const wordSize = Math.max(8, Math.min(13, 150 / len));

    switch (logoStyle) {
      case 'wordmark':
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <text x="50" y="49" font-family="'Outfit', sans-serif" font-size="${Math.max(7, Math.min(16, 165 / len))}" font-weight="900" fill="${secondaryColor}" text-anchor="middle" letter-spacing="-0.5">${name}</text>
            <path d="M24 58 Q50 68 76 58" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round" />
            <text x="50" y="71" font-family="'Inter', sans-serif" font-size="4" font-weight="600" fill="${secondaryColor}" text-anchor="middle" letter-spacing="3" opacity="0.6">EST. ${esc(estYear)}</text>
          </svg>`;
      case 'lettermark':
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="28" y="20" width="44" height="44" rx="12" fill="${primaryColor}" />
            <text x="50" y="51" font-family="'Outfit', sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">${initials}</text>
            <text x="50" y="80" font-family="'Outfit', sans-serif" font-size="${Math.max(5, Math.min(8, 120 / len))}" font-weight="700" fill="${secondaryColor}" text-anchor="middle" letter-spacing="1">${esc((brandName || 'Brand').toUpperCase())}</text>
          </svg>`;
      case 'icon':
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="40" fill="${primaryColor}" opacity="0.08" />
            <g transform="translate(50 50) scale(1.05) translate(-50 -50)">${motifSvg}</g>
          </svg>`;
      case 'abstract':
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="43" cy="39" r="17" fill="${primaryColor}" opacity="0.85" />
            <circle cx="57" cy="39" r="17" fill="${secondaryColor}" opacity="0.8" />
            <circle cx="50" cy="52" r="17" fill="${primaryColor}" opacity="0.55" />
            <text x="50" y="86" font-family="'Outfit', sans-serif" font-size="${wordSize}" font-weight="800" fill="${secondaryColor}" text-anchor="middle" letter-spacing="-0.3">${name}</text>
          </svg>`;
      case 'mascot':
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 19c-3-2-8-3-8-3s1 4 3 6c-7 2-13 9-13 18 0 12 11 22 18 22s18-10 18-22c0-10-8-18-18-21z" fill="${primaryColor}" />
            <path d="M50 16c0-3 3-6 6-7 0 0-1 4-3 6-1 1-2 1-3 1z" fill="#15803d" />
            <circle cx="44" cy="41" r="2.6" fill="${secondaryColor}" />
            <circle cx="56" cy="41" r="2.6" fill="${secondaryColor}" />
            <path d="M44 48 Q50 54 56 48" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round" />
            <circle cx="39" cy="46" r="2.2" fill="#ffffff" opacity="0.35" />
            <circle cx="61" cy="46" r="2.2" fill="#ffffff" opacity="0.35" />
            <text x="50" y="87" font-family="'Outfit', sans-serif" font-size="${wordSize}" font-weight="800" fill="${secondaryColor}" text-anchor="middle" letter-spacing="-0.3">${name}</text>
          </svg>`;
      case 'emblem':
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="42" fill="none" stroke="${primaryColor}" stroke-width="3" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="${secondaryColor}" stroke-width="0.75" stroke-dasharray="2,2" />
            <g transform="translate(0 -2)">${motifSvg}</g>
            <path id="curve" d="M 22 50 A 28 28 0 1 1 78 50" fill="none" />
            <text font-family="'Outfit', sans-serif" font-size="6" font-weight="800" fill="${primaryColor}" letter-spacing="1">
              <textPath href="#curve" startOffset="50%" text-anchor="middle">${esc((brandName || 'Brand').toUpperCase())}</textPath>
            </text>
            <text x="50" y="76" font-family="'Inter', sans-serif" font-size="4.5" font-weight="700" fill="${secondaryColor}" text-anchor="middle">EST. ${esc(estYear)}</text>
            <text x="50" y="82" font-family="'Inter', sans-serif" font-size="3.5" font-weight="600" fill="${primaryColor}" text-anchor="middle" letter-spacing="0.5">CAMBODIA</text>
          </svg>`;
      case 'combination':
      default:
        return `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(50 29) scale(0.58) translate(-50 -50)">${motifSvg}</g>
            <text x="50" y="66" font-family="'Outfit', sans-serif" font-size="${wordSize}" font-weight="800" fill="${secondaryColor}" text-anchor="middle" letter-spacing="-0.3">${name}</text>
            <path d="M28 72 Q50 80 72 72" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round" />
            <text x="50" y="84" font-family="'Inter', sans-serif" font-size="3.8" font-weight="600" fill="${secondaryColor}" text-anchor="middle" letter-spacing="2" opacity="0.6">EST. ${esc(estYear)} · CAMBODIA</text>
          </svg>`;
    }
  };

  // Helper to serialize React-like motif structure into clean string inside templates
  const renderSvgStringToHtml = (element) => {
    if (element.type === 'path') {
      const fill = element.props.fill;
      const d = element.props.d;
      return `<path fill="${fill}" d="${d}" />`;
    } else if (element.type === 'g') {
      const fill = element.props.fill;
      const children = React.Children.map(element.props.children, child => {
        if (child.type === 'circle') {
          return `<circle cx="${child.props.cx}" cy="${child.props.cy}" r="${child.props.r}" />`;
        } else if (child.type === 'path') {
          return `<path d="${child.props.d}" fill="${child.props.fill || ''}" />`;
        }
        return '';
      }).join('');
      return `<g fill="${fill}">${children}</g>`;
    }
    return '';
  };

  const [logoPrompt, setLogoPrompt] = useState(productName ? `${productName} minimalist brand icon` : 'mango fruit emblem');
  const [generatedSvg, setGeneratedSvg] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleApplyLogo = () => {
    if (generatedImage) {
      onApplyLogo(null, generatedImage);
    } else {
      onApplyLogo(generatedSvg || generateVectorSvg(), null);
    }
  };

  const handleRealAiGeneration = async () => {
    setIsGenerating(true);
    setGeneratedSvg(null);
    setGeneratedImage(null);
    try {
      const response = await fetch('/api/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: logoPrompt,
          brandName,
          estYear,
          primaryColor,
          secondaryColor,
          logoStyle
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.image) {
          setGeneratedImage(data.image);
          setGeneratedSvg(null);
        } else {
          throw new Error('No image returned');
        }
      } else {
        throw new Error('API failed');
      }
    } catch (err) {
      console.warn("AI Logo failed, using fallback vector template", err);
      setGeneratedSvg(generateVectorSvg());
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* Left Panel: Inputs (1/3 size - lg:col-span-4) */}
      <div className="lg:col-span-4 flex flex-col gap-5 glass p-6 rounded-2xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Sparkles size={16} className="text-amber-500" /> Logo Parameters
        </h2>

        {/* Dynamic Logo Prompt Textbox */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Describe Logo Motif</label>
          <textarea
            rows={3}
            value={logoPrompt}
            onChange={(e) => { setLogoPrompt(e.target.value); setGeneratedSvg(null); setGeneratedImage(null); }}
            placeholder="e.g. A detailed line art mango fruit, organic traditional vibes"
            className="w-full px-3 py-2 rounded-lg bg-navy/50 border border-white/5 text-white text-xs outline-none focus:border-amber-500/40 resize-none"
          />
        </div>

        {/* Brand Text Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => { setBrandName(e.target.value); setGeneratedSvg(null); setGeneratedImage(null); }}
            placeholder="e.g. Agri Khmer"
            className="w-full px-3 py-2 rounded-lg bg-navy/50 border border-white/5 text-white text-sm outline-none focus:border-amber-500/40"
          />
        </div>

        {/* Est Year Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Establishing Year</label>
          <input
            type="text"
            value={estYear}
            onChange={(e) => { setEstYear(e.target.value); setGeneratedSvg(null); setGeneratedImage(null); }}
            placeholder="e.g. 2026"
            className="w-full px-3 py-2 rounded-lg bg-navy/50 border border-white/5 text-white text-sm outline-none focus:border-amber-500/40"
          />
        </div>

        {/* Color Pickers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Primary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => { setPrimaryColor(e.target.value); setGeneratedSvg(null); setGeneratedImage(null); }}
                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-mono uppercase">{primaryColor}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-300">Secondary Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => { setSecondaryColor(e.target.value); setGeneratedSvg(null); setGeneratedImage(null); }}
                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer"
              />
              <span className="text-xs text-slate-400 font-mono uppercase">{secondaryColor}</span>
            </div>
          </div>
        </div>

        {/* Logo style — drives the AI generation toward a real logo type (not a fixed badge) */}
        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
          <label className="text-xs font-bold text-slate-300">Logo Style</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'combination', name: '🔗 Combination' },
              { id: 'wordmark', name: '🔤 Wordmark' },
              { id: 'lettermark', name: '🅰️ Lettermark' },
              { id: 'icon', name: '🟠 Icon / Symbol' },
              { id: 'abstract', name: '🌀 Abstract' },
              { id: 'mascot', name: '🐭 Mascot' },
              { id: 'emblem', name: '⭕ Emblem / Seal' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setLogoStyle(item.id); setGeneratedSvg(null); setGeneratedImage(null); }}
                className={`py-1.5 px-2.5 rounded-lg text-[10px] font-semibold text-left border transition-all ${
                  logoStyle === item.id
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-navy/30 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
          <button
            onClick={handleRealAiGeneration}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-all flex items-center justify-center gap-2 shadow"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> AI Branding Agent Running...
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-amber-500" /> AI Generate Logo
              </>
            )}
          </button>

          <button
            onClick={handleApplyLogo}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Check size={16} /> Apply Logo to Active Label
          </button>
        </div>
      </div>

      {/* Right Panel: Logo Canvas Preview (2/3 size - lg:col-span-8) */}
      <div className="lg:col-span-8 flex flex-col gap-6 glass p-6 rounded-2xl items-center justify-center min-h-[450px] relative">
        <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          Logo Artboard Preview
        </div>

        <div className="w-64 h-64 rounded-xl border border-white/10 bg-white shadow-2xl flex items-center justify-center p-6 transition-all duration-300">
          {generatedImage ? (
            <img src={generatedImage} className="w-full h-full object-contain" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center logo-svg-preview"
              dangerouslySetInnerHTML={{ __html: generatedSvg || generateVectorSvg() }}
            />
          )}
        </div>

        <div className="text-center max-w-sm mt-2">
          <p className="text-xs font-semibold text-slate-400">
            {generatedSvg 
              ? 'This is a dynamic AI-generated vector asset. Apply it to render it inside your compliance labels.'
              : 'This is a template preview. Enter an AI prompt above and generate to design a custom graphic motif.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
