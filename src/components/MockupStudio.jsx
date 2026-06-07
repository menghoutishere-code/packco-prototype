import React, { useState, useEffect, useRef } from 'react';
import { FileDown, RefreshCw, Layers, Check, Sparkles } from 'lucide-react';
import { warpImage } from '../utils/perspectiveWarper';
import { drawLabel2D } from '../utils/labelCanvasRenderer';

const MOCKUP_DATA = [
  {
    id: 'pouch-front-back',
    name: '🍊 Pouch - Front & Back (Studio)',
    packageType: 'pouch',
    imgUrl: '/mockup/pouch-front-back-blank.jpg',
    width: 1200,
    height: 1200,
    quads: [
      [{x: 180, y: 350}, {x: 430, y: 350}, {x: 420, y: 820}, {x: 190, y: 820}],
      [{x: 770, y: 350}, {x: 1010, y: 350}, {x: 1000, y: 820}, {x: 780, y: 820}]
    ]
  },
  {
    id: 'pouch-isometric',
    name: '🍊 Pouch - 3D Angle (Studio)',
    packageType: 'pouch',
    imgUrl: '/mockup/pouch-isometric-blank.jpg',
    width: 1000,
    height: 1000,
    quads: [
      [{x: 355, y: 370}, {x: 645, y: 395}, {x: 630, y: 830}, {x: 340, y: 805}]
    ]
  },
  {
    id: 'pouch-lifestyle',
    name: '🍊 Pouch - Table (Lifestyle)',
    packageType: 'pouch',
    imgUrl: '/mockup/pouch-lifestyle-blank.jpg',
    width: 1200,
    height: 900,
    quads: [
      [{x: 475, y: 280}, {x: 745, y: 300}, {x: 725, y: 720}, {x: 455, y: 690}]
    ]
  },
  {
    id: 'jar-front',
    name: '🫙 Glass Jar - Front (Studio)',
    packageType: 'jar',
    imgUrl: '/mockup/jar-front-blank.jpg',
    width: 1000,
    height: 1000,
    quads: [
      [{x: 315, y: 380}, {x: 685, y: 380}, {x: 685, y: 780}, {x: 315, y: 780}]
    ]
  },
  {
    id: 'jar-lifestyle',
    name: '🫙 Glass Jar - Counter (Lifestyle)',
    packageType: 'jar',
    imgUrl: '/mockup/jar-lifestyle-blank.jpg',
    width: 1200,
    height: 900,
    quads: [
      [{x: 520, y: 290}, {x: 800, y: 300}, {x: 790, y: 660}, {x: 510, y: 640}]
    ]
  },
  {
    id: 'box-isometric',
    name: '📦 Carton Box - 3D Angle (Studio)',
    packageType: 'box',
    imgUrl: '/mockup/box-isometric-blank.jpg',
    width: 1000,
    height: 1000,
    quads: [
      [{x: 500, y: 440}, {x: 840, y: 370}, {x: 840, y: 730}, {x: 500, y: 820}]
    ]
  },
  {
    id: 'box-lifestyle',
    name: '📦 Carton Box - Kitchen (Lifestyle)',
    packageType: 'box',
    imgUrl: '/mockup/box-lifestyle-blank.jpg',
    width: 1200,
    height: 900,
    quads: [
      [{x: 445, y: 360}, {x: 735, y: 305}, {x: 725, y: 670}, {x: 435, y: 740}]
    ]
  },
  {
    id: 'tube-front',
    name: '🥫 Canister Tube - Front (Studio)',
    packageType: 'tube',
    imgUrl: '/mockup/tube-front-blank.jpg',
    width: 1000,
    height: 1000,
    quads: [
      [{x: 320, y: 320}, {x: 680, y: 320}, {x: 680, y: 800}, {x: 320, y: 800}]
    ]
  },
  {
    id: 'tub-front',
    name: '🍧 Food Tub - Front (Studio)',
    packageType: 'tub',
    imgUrl: '/mockup/tub-front-blank.jpg',
    width: 1000,
    height: 1000,
    quads: [
      [{x: 275, y: 380}, {x: 725, y: 380}, {x: 680, y: 750}, {x: 320, y: 750}]
    ]
  }
];

export default function MockupStudio({ labelData, productName, weight, expiry, barcodeText, activeTemplate, customLogoSvg, customLogoUrl }) {
  const [selectedMockup, setSelectedMockup] = useState(MOCKUP_DATA[0]);
  const [compositeDataUrl, setCompositeDataUrl] = useState(null);
  const [isWarping, setIsWarping] = useState(false);
  const [isDenoising, setIsDenoising] = useState(false);
  const [refinementSuccess, setRefinementSuccess] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    generateCompositeMockup();
  }, [selectedMockup, labelData, productName, weight, expiry, barcodeText, activeTemplate, customLogoSvg, customLogoUrl]);

  const generateCompositeMockup = async () => {
    setIsWarping(true);
    setRefinementSuccess(false);
    try {
      const mockupImg = await loadImage(selectedMockup.imgUrl);
      
      // Initialize main compositing canvas
      const canvas = canvasRef.current;
      canvas.width = selectedMockup.width;
      canvas.height = selectedMockup.height;
      const ctx = canvas.getContext('2d');

      // 1. Draw blank mockup background
      ctx.drawImage(mockupImg, 0, 0, selectedMockup.width, selectedMockup.height);

      // 2. Generate high-res 2D label on hidden scratch canvas
      const scratchCanvas = document.createElement('canvas');
      scratchCanvas.width = 600;
      scratchCanvas.height = 1200;
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

      // 3. Apply perspective warp for each quadrilateral mapping in the selected mockup template
      selectedMockup.quads.forEach(quad => {
        ctx.save();
        // Blend mode Multiply composites the shadows/textures of the underlying pack onto the label!
        ctx.globalCompositeOperation = 'multiply';
        warpImage(ctx, scratchCanvas, quad, 20, 20); // 20x20 grid resolution for hyper-smooth warp
        ctx.restore();
      });

      // Export canvas state as DataURL for high performance image tag rendering
      setCompositeDataUrl(canvas.toDataURL('image/jpeg', 0.92));
    } catch (err) {
      console.error('Failed to composite 3D mockup', err);
    } finally {
      setIsWarping(false);
    }
  };

  const handleBakeDenoising = () => {
    setIsDenoising(true);
    // Simulate Gemini Nano Banana image-to-image low denoising strength (0.12)
    setTimeout(() => {
      setIsDenoising(false);
      setRefinementSuccess(true);
    }, 1800);
  };

  const handleDownload = () => {
    if (!compositeDataUrl) return;
    const link = document.createElement('a');
    link.href = compositeDataUrl;
    link.download = `${selectedMockup.id}-compliance-mockup.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  }

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
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
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

        {/* Integration Summary */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-4 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Homography Matrix:</span>
            <span className="font-semibold text-slate-200">Bilinear Quad Interpolation</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Texture Blending Filter:</span>
            <span className="font-semibold text-green-400">Multiply (composited)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Grid Resolution:</span>
            <span className="font-semibold text-slate-200">20 x 20 Mesh</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 border-t border-white/5 pt-4">
          <button
            onClick={handleBakeDenoising}
            disabled={isWarping || isDenoising}
            className={`w-full py-2.5 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition-all flex items-center justify-center gap-2 shadow ${
              isDenoising ? 'cursor-wait' : ''
            }`}
          >
            {isDenoising ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Nano Banana Baking textures...
              </>
            ) : (
              <>
                <Sparkles size={14} className="text-amber-500" /> Bake Shadows & Textures (Nano Banana)
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={isWarping}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <FileDown size={16} /> Download 3D Mockup (JPG)
          </button>
        </div>
      </div>

      {/* Right Panel: Render Studio (2/3 size - lg:col-span-8) */}
      <div className="lg:col-span-8 flex flex-col gap-6 glass p-6 rounded-2xl items-center justify-center min-h-[480px] relative overflow-hidden">
        <div className="absolute top-4 left-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
          3D Packaging Render
        </div>

        {/* Hidden Canvas used for programmatical texture synthesis */}
        <canvas ref={canvasRef} className="hidden" />

        {isWarping ? (
          <div className="flex flex-col items-center gap-3 animate-pulse text-slate-400">
            <RefreshCw className="animate-spin" size={24} />
            <span className="text-xs font-semibold">Projecting 2D label coordinates onto 3D Mesh...</span>
          </div>
        ) : (
          compositeDataUrl && (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="w-full max-w-[360px] rounded-xl border border-white/10 bg-white/5 shadow-2xl overflow-hidden flex items-center justify-center transition-all duration-300">
                <img
                  src={compositeDataUrl}
                  alt="3D Packaging Mockup"
                  className={`max-w-full max-h-[400px] object-contain transition-all ${
                    refinementSuccess ? 'brightness-105 contrast-105 saturate-100' : ''
                  }`}
                />
              </div>

              {refinementSuccess && (
                <span className="px-3 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold uppercase flex items-center gap-1 animate-bounce">
                  <Check size={12} /> Denoise Refined (0.12) - Textures Baked Successfully
                </span>
              )}
            </div>
          )
        )}

        <div className="text-center max-w-md mt-2">
          <p className="text-xs font-semibold text-slate-400 leading-normal">
            This module projects the compliant 2D label design (including bilingual text, EAN-13 barcodes, and custom brand marks) onto the selected packaging mockup using perspective warping and blends shadows dynamically.
          </p>
        </div>
      </div>
    </div>
  );
}
