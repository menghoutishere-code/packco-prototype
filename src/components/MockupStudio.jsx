import React, { useState, useEffect } from 'react';
import { FileDown, RefreshCw, Layers, Check, Sparkles } from 'lucide-react';
import { drawLabel2D } from '../utils/labelCanvasRenderer';
import { drawFrontPanel, themeForTemplate } from '../utils/frontPanelRenderer';

const MOCKUP_DATA = [
  {
    id: 'pouch-front-back',
    name: '🍊 Pouch - Front & Back (Studio)',
    packageType: 'pouch',
    imgUrl: '/mockup/pouch-front-back-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 375, y: 230}, {x: 595, y: 230}, {x: 590, y: 410}, {x: 380, y: 410}],
      [{x: 705, y: 230}, {x: 915, y: 230}, {x: 910, y: 620}, {x: 710, y: 620}]
    ]
  },
  {
    id: 'jar-front',
    name: '🫙 Glass Jar - Front (Studio)',
    packageType: 'jar',
    imgUrl: '/mockup/jar-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 540, y: 290}, {x: 760, y: 290}, {x: 760, y: 610}, {x: 540, y: 610}]
    ]
  },
  {
    id: 'jar-lifestyle',
    name: '🫙 Glass Jar - Counter (Lifestyle)',
    packageType: 'jar',
    imgUrl: '/mockup/jar-lifestyle-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 540, y: 290}, {x: 760, y: 290}, {x: 760, y: 610}, {x: 540, y: 610}]
    ]
  },
  {
    id: 'box-isometric',
    name: '📦 Carton Box - 3D Angle (Studio)',
    packageType: 'box',
    imgUrl: '/mockup/box-isometric-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 410, y: 220}, {x: 760, y: 185}, {x: 760, y: 600}, {x: 410, y: 560}]
    ]
  },
  {
    id: 'box-lifestyle',
    name: '📦 Carton Box - Kitchen (Lifestyle)',
    packageType: 'box',
    imgUrl: '/mockup/box-lifestyle-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 675, y: 365}, {x: 875, y: 365}, {x: 875, y: 615}, {x: 675, y: 615}]
    ]
  },
  {
    id: 'tube-front',
    name: '🥫 Canister Tube - Front (Studio)',
    packageType: 'tube',
    imgUrl: '/mockup/tube-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 550, y: 230}, {x: 750, y: 230}, {x: 750, y: 640}, {x: 550, y: 640}]
    ]
  },
  {
    id: 'tub-front',
    name: '🍧 Food Tub - Front (Studio)',
    packageType: 'tub',
    imgUrl: '/mockup/tub-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 420, y: 265}, {x: 880, y: 265}, {x: 850, y: 635}, {x: 450, y: 635}]
    ]
  },
  {
    id: 'vacuum-front',
    name: '🥩 Vacuum Pack - Front (Studio)',
    packageType: 'vacuum',
    imgUrl: '/mockup/vacuum-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 500, y: 250}, {x: 800, y: 250}, {x: 790, y: 560}, {x: 510, y: 560}]
    ]
  },
  {
    id: 'flatbag-front',
    name: '🍜 Flat-Bottom Bag - Front (Studio)',
    packageType: 'flatbag',
    imgUrl: '/mockup/flatbag-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 540, y: 240}, {x: 770, y: 240}, {x: 765, y: 600}, {x: 545, y: 600}]
    ]
  },
  {
    id: 'cleartub-front',
    name: '🥔 Clear Snack Tub - Front (Studio)',
    packageType: 'cleartub',
    imgUrl: '/mockup/cleartub-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 545, y: 250}, {x: 760, y: 250}, {x: 760, y: 560}, {x: 545, y: 560}]
    ]
  },
  {
    id: 'kraftcarton-front',
    name: '🍬 Kraft Carton - Front (Studio)',
    packageType: 'box',
    imgUrl: '/mockup/kraftcarton-front-blank.jpg',
    width: 1408,
    height: 768,
    quads: [
      [{x: 530, y: 240}, {x: 780, y: 240}, {x: 780, y: 600}, {x: 530, y: 600}]
    ]
  }
];

export default function MockupStudio({ labelData, productName, weight, expiry, barcodeText, activeTemplate, customLogoSvg, customLogoUrl }) {
  const [selectedMockup, setSelectedMockup] = useState(MOCKUP_DATA[0]);
  const [designPreviewUrl, setDesignPreviewUrl] = useState(null);
  const [refinementSuccess, setRefinementSuccess] = useState(false);
  const [mockupPrompt, setMockupPrompt] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [usingFallbackHero, setUsingFallbackHero] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  useEffect(() => {
    // Clear any prior AI result when inputs change, and refresh the flat design preview.
    setResultImage(null);
    setUsingFallbackHero(false);
    setRefinementSuccess(false);
    refreshDesignPreview();
  }, [selectedMockup, labelData, productName, weight, activeTemplate, customLogoSvg, customLogoUrl]);

  // Renders the 2D label onto a fresh in-memory scratch canvas using the same
  // drawLabel2D call (and props) used by the local composite preview.
  const renderLabelScratchCanvas = async () => {
    const scratchCanvas = document.createElement('canvas');
    const isPanel = activeTemplate === 'panel';
    scratchCanvas.width = isPanel ? 600 : 900;
    scratchCanvas.height = isPanel ? 1200 : 600;

    await drawLabel2D(
      scratchCanvas,
      labelData,
      productName,
      weight,
      expiry,
      barcodeText,
      activeTemplate,
      customLogoSvg,
      customLogoUrl
    );

    return scratchCanvas;
  };

  // Renders the clean front-of-pack design (the wrap input) to a fresh canvas.
  const renderFrontPanelCanvas = async () => {
    const canvas = document.createElement('canvas');
    await drawFrontPanel(canvas, {
      productName,
      productNameKh: labelData?.productNameKh,
      weight,
      theme: themeForTemplate(activeTemplate),
      logoSvg: customLogoSvg,
      logoUrl: customLogoUrl,
    });
    return canvas;
  };

  // Builds the flat front-of-pack design preview shown beside the blank package.
  const refreshDesignPreview = async () => {
    try {
      const canvas = await renderFrontPanelCanvas();
      setDesignPreviewUrl(canvas.toDataURL('image/png'));
    } catch (err) {
      console.error('Failed to render front-of-pack preview', err);
    }
  };

  const handleAiMockupGeneration = async () => {
    setIsAiGenerating(true);
    setRefinementSuccess(false);
    setUsingFallbackHero(false);
    try {
      // The wrap input is the clean front-of-pack design, not the dense compliance label.
      const designCanvas = await renderFrontPanelCanvas();
      const designPng = designCanvas.toDataURL('image/png').split(',')[1];

      const response = await fetch('/api/mockup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockupId: selectedMockup.id,
          designPng,
          userPrompt: mockupPrompt
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      if (!data.image) {
        throw new Error('No image returned');
      }

      setResultImage(data.image);
      setRefinementSuccess(true);
    } catch (err) {
      console.warn("AI Mockup failed, falling back to pre-rendered hero", err);
      // Hero fallback insurance: show a pre-baked sample for this package type.
      // If the file is missing the <img> onError handler swaps in the local composite.
      setUsingFallbackHero(true);
      setResultImage(`/hero/${selectedMockup.packageType}.jpg`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const triggerDownload = (href, filename) => {
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadLabel = async () => {
    // Print-ready label: render label to a scratch canvas and export PNG
    const scratchCanvas = await renderLabelScratchCanvas();
    triggerDownload(scratchCanvas.toDataURL('image/png'), `${selectedMockup.id}-label.png`);
  };

  const handleDownloadMockup = () => {
    // Marketing mockup: the AI result if present, otherwise the flat design.
    if (resultImage) {
      triggerDownload(resultImage, `${selectedMockup.id}-mockup.png`);
    } else if (designPreviewUrl) {
      triggerDownload(designPreviewUrl, `${selectedMockup.id}-design.png`);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Left Panel: Controls (1/3 size - lg:col-span-4) */}
      <div className="lg:col-span-4 flex flex-col gap-5 glass p-6 rounded-2xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
          <Layers size={16} className="text-amber-500" /> Mockup Parameters
        </h2>

        {/* Mockup Selector strip */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-300">Select Packaging Template</label>
          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-1">
            {MOCKUP_DATA.map(mockup => (
              <button
                key={mockup.id}
                onClick={() => setSelectedMockup(mockup)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  selectedMockup.id === mockup.id
                    ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5' 
                    : 'bg-navy/30 border-white/5 hover:border-white/10'
                }`}
              >
                <span className="text-xs font-bold text-white">{mockup.name}</span>
                <span className="text-[9px] text-slate-400">Resolution: {mockup.width}x{mockup.height}px</span>
              </button>
            ))}
          </div>
        </div>

        {/* Refinement Prompt */}
        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
          <label className="text-xs font-bold text-slate-300">Mockup Refinement Prompt</label>
          <textarea
            rows={3}
            value={mockupPrompt}
            onChange={(e) => setMockupPrompt(e.target.value)}
            placeholder="e.g. Wrap the label naturally around the pouch shape, adding soft shadows and matching highlights."
            className="w-full px-3 py-2 rounded-lg bg-navy/50 border border-white/5 text-white text-xs outline-none focus:border-amber-500/40 resize-none"
          />
        </div>

        {/* Integration Summary */}
        <div className="flex flex-col gap-2.5 border-t border-white/5 pt-3 text-[11px]">
          <div className="flex justify-between">
            <span className="text-slate-400">Wrap Input:</span>
            <span className="font-semibold text-slate-200">Front-of-pack design</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">API Generator:</span>
            <span className="font-semibold text-green-400">gemini-3.1-flash-image</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Texture Compositor:</span>
            <span className="font-semibold text-slate-200">Nano Banana image-to-image</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
          <button
            onClick={handleAiMockupGeneration}
            disabled={isAiGenerating}
            className={`w-full py-2.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-all flex items-center justify-center gap-2 shadow ${
              isAiGenerating ? 'cursor-wait' : ''
            }`}
          >
            {isAiGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Wrapping design onto package...
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-amber-500" /> Generate AI Mockup
              </>
            )}
          </button>

          <button
            onClick={handleDownloadMockup}
            disabled={isAiGenerating}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <FileDown size={16} /> Download Marketing Mockup
          </button>

          <button
            onClick={handleDownloadLabel}
            disabled={isAiGenerating}
            className="w-full py-2.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            <FileDown size={14} /> Download Print-Ready Label
          </button>
        </div>
      </div>

      {/* Right Panel: Render Studio (2/3 size - lg:col-span-8) */}
      <div className="lg:col-span-8 flex flex-col gap-6 glass p-6 rounded-2xl items-center justify-center min-h-[480px] relative overflow-hidden">
        <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          3D Packaging Render
        </div>

        {isAiGenerating ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <RefreshCw className="animate-spin" size={24} />
            <span className="text-xs font-semibold">Wrapping your design onto the package...</span>
          </div>
        ) : resultImage ? (
          // The AI marketing mockup (hero). On error fall back to the flat design.
          <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
            <div className="w-full max-w-[480px] aspect-[1408/768] rounded-xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden flex items-center justify-center">
              <img
                src={resultImage}
                alt="AI Marketing Mockup"
                className="max-w-full max-h-full object-contain"
                onError={(e) => { if (designPreviewUrl) e.currentTarget.src = designPreviewUrl; }}
              />
            </div>
            {usingFallbackHero ? (
              <span className="px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold uppercase flex items-center gap-1">
                Showing pre-rendered sample (live generation unavailable)
              </span>
            ) : (
              <span className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase flex items-center gap-1">
                <Check size={12} /> AI Marketing Mockup Generated
              </span>
            )}
          </div>
        ) : (
          // Pre-generation: the clean blank package + the flat front-of-pack design.
          <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-[300px] aspect-[1408/768] rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                  <img src={selectedMockup.imgUrl} alt="Blank package" className="max-w-full max-h-full object-contain" />
                </div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Blank package</span>
              </div>
              <div className="text-slate-500 text-2xl font-light">+</div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-[140px] aspect-[4/5] rounded-xl border border-white/10 bg-white overflow-hidden flex items-center justify-center">
                  {designPreviewUrl && <img src={designPreviewUrl} alt="Front-of-pack design" className="max-w-full max-h-full object-contain" />}
                </div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Your design</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center max-w-md mt-2">
          <p className="text-xs font-semibold text-slate-400 leading-normal">
            {resultImage
              ? (usingFallbackHero
                  ? 'Showing a pre-rendered sample mockup. Live AI generation was unavailable for this run.'
                  : 'Gemini wrapped your front-of-pack design onto the packaging, matching lighting and perspective.')
              : 'Click "Generate AI Mockup" to wrap your front-of-pack design onto the selected package.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
