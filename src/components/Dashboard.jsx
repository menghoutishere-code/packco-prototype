import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { LogOut, RefreshCw, FileDown, AlertTriangle, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [productName, setProductName] = useState('Dried Spicy Mango');
  const [rawIngredients, setRawIngredients] = useState('Ripe Mango 85%, Sugar 12%, Chili 3%');
  const [weight, setWeight] = useState('100g');
  const [expiry, setExpiry] = useState('6 months');
  const [barcodeText, setBarcodeText] = useState('8841234567890');
  
  const [isLoading, setIsLoading] = useState(false);
  const [labelData, setLabelData] = useState({
    productNameKh: 'ស្វាយសម្ងួតហឹរ',
    ingredients: [
      { nameKh: 'ស្វាយទុំ', percentage: 85 },
      { nameKh: 'ស្ករស', percentage: 12 },
      { nameKh: 'ម្ទេស', percentage: 3 }
    ],
    nutritionFacts: {
      servingSize: '100g',
      calories: 340,
      fat: 1.2,
      carbs: 82.0,
      protein: 1.5,
      sodium: 180
    },
    allergensKh: [],
    mandatoryWarningsKh: ['រក្សាទុកក្នុងកន្លែងត្រជាក់និងស្ងួត']
  });

  const barcodeRef = useRef(null);

  // Render barcode whenever barcodeText changes
  useEffect(() => {
    if (barcodeRef.current && barcodeText) {
      try {
        JsBarcode(barcodeRef.current, barcodeText, {
          format: "EAN13",
          width: 1.5,
          height: 40,
          displayValue: true,
          fontSize: 10,
          margin: 0
        });
      } catch (err) {
        // Fallback to CODE128 if not valid EAN13
        try {
          JsBarcode(barcodeRef.current, barcodeText, {
            format: "CODE128",
            width: 1.5,
            height: 40,
            displayValue: true,
            fontSize: 10,
            margin: 0
          });
        } catch (e) {
          console.error("Barcode rendering failed", e);
        }
      }
    }
  }, [barcodeText, labelData]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawInput: `Product: ${productName}, Ingredients: ${rawIngredients}, Weight: ${weight}, Expiry: ${expiry}` })
      });
      
      if (response.ok) {
        const data = await response.json();
        setLabelData(data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      // Fallback offline mock processing (for local testing/demos)
      setTimeout(() => {
        const parsedIngs = rawIngredients.split(',').map(item => {
          const parts = item.trim().split(/\s+(\d+)%/);
          const name = parts[0];
          const pct = parts[1] ? parseInt(parts[1]) : 10;
          return { nameKh: translateMockIng(name), percentage: pct };
        });

        setLabelData({
          productNameKh: translateMockName(productName),
          ingredients: parsedIngs,
          nutritionFacts: {
            servingSize: weight,
            calories: Math.floor(Math.random() * 200) + 150,
            fat: parseFloat((Math.random() * 3).toFixed(1)),
            carbs: Math.floor(Math.random() * 50) + 30,
            protein: parseFloat((Math.random() * 5).toFixed(1)),
            sodium: Math.floor(Math.random() * 300) + 50
          },
          allergensKh: checkMockAllergens(rawIngredients),
          mandatoryWarningsKh: ['រក្សាទុកក្នុងកន្លែងត្រជាក់និងស្ងួត']
        });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const translateMockIng = (name) => {
    const dict = {
      'mango': 'ស្វាយទុំ',
      'sugar': 'ស្ករស',
      'chili': 'ម្ទេស',
      'banana': 'ចេកទុំ',
      'taro': 'ត្រាវ',
      'beef': 'សាច់គោ',
      'pork': 'សាច់ជ្រូក',
      'salt': 'អំបិល',
      'cashew': 'គ្រាប់ស្វាយចន្ទី',
      'honey': 'ទឹកឃ្មុំ'
    };
    const key = name.toLowerCase().trim();
    for (let k in dict) {
      if (key.includes(k)) return dict[k];
    }
    return `គ្រឿងផ្សំ ${name}`;
  };

  const translateMockName = (name) => {
    const dict = {
      'dried spicy mango': 'ស្វាយសម្ងួតហឹរ',
      'banana chips': 'ចេកចៀន',
      'taro chips': 'ត្រាវចៀន',
      'dried beef': 'សាច់គោក្រៀម',
      'chili paste': 'ទឹកម្ទេស'
    };
    const key = name.toLowerCase().trim();
    return dict[key] || name;
  };

  const checkMockAllergens = (ings) => {
    const allergens = [];
    const lower = ings.toLowerCase();
    if (lower.includes('cashew') || lower.includes('nut') || lower.includes('គ្រាប់')) {
      allergens.push('គ្រាប់ស្វាយចន្ទី / Nuts');
    }
    if (lower.includes('shrimp') || lower.includes('shrimp paste') || lower.includes('បង្គា')) {
      allergens.push('បង្គា / Crustaceans');
    }
    return allergens;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center border-b border-white/5 no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber to-amber-light flex items-center justify-center font-outfit text-white font-extrabold text-lg shadow-lg">P</div>
          <span className="font-outfit text-lg font-bold text-white tracking-tight">PackCo<span className="text-amber">.ai</span></span>
          <span className="px-2 py-0.5 rounded bg-amber/10 border border-amber/20 text-amber text-[10px] font-semibold uppercase">Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-light/60">Logged in as: <strong>admin</strong></span>
          <button 
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all duration-200 border border-white/10 flex items-center gap-2"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 no-print">
        
        {/* Left Column: Input Form (lg:col-span-4) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl flex flex-col gap-5 text-left">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-3">Label Parameters</h2>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-light/80">Product Name (EN)</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 text-white text-sm outline-none transition-all duration-200"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-light/80">Raw Ingredients & %</label>
              <textarea 
                rows={3}
                value={rawIngredients}
                onChange={(e) => setRawIngredients(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 text-white text-sm outline-none transition-all duration-200"
              />
              <span className="text-[10px] text-slate-light/50">Example: Ripe Mango 85%, Sugar 12%, Chili 3%</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-light/80">Net Weight</label>
                <input 
                  type="text" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 text-white text-sm outline-none transition-all duration-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-light/80">Expiry Period</label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 text-white text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-light/80">GS1 Barcode Value (EAN-13)</label>
              <input 
                type="text" 
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber/40 text-white text-sm outline-none transition-all duration-200"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-tr from-amber to-amber-light hover:from-amber-light hover:to-amber text-white font-semibold shadow-lg shadow-amber/20 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Parsing Compliance...
                </>
              ) : (
                <>
                  Generate Label Compliance
                </>
              )}
            </button>
          </div>
        </section>

        {/* Center Column: Live Label Preview (lg:col-span-4) */}
        <section className="lg:col-span-4 flex flex-col gap-6 items-center">
          <div className="w-full glass p-6 rounded-2xl flex flex-col gap-4 text-left">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="text-base font-bold text-white">Live Compliance Preview</h2>
              <button 
                onClick={handlePrint}
                className="px-3 py-1.5 rounded bg-amber hover:bg-amber-light text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow"
              >
                <FileDown size={14} /> Export PDF
              </button>
            </div>

            {/* Label Wrapper (styled to look like a physical package label tag) */}
            <div className="mx-auto w-full max-w-[240px] bg-white text-black p-4 border-2 border-black rounded shadow-2xl flex flex-col gap-2 font-sans">
              <div className="text-center font-outfit font-extrabold text-sm border-b-2 border-black pb-1.5 uppercase tracking-wide">
                PackCo Compliance
              </div>
              
              {/* Product Title */}
              <div className="text-center">
                <div className="font-bold text-base leading-tight font-sans">{labelData.productNameKhmer || labelData.productNameKh}</div>
                <div className="text-[10px] text-slate-dark italic leading-none">{productName}</div>
              </div>

              {/* Nutrition Facts */}
              <div className="border-t border-black pt-1">
                <div className="text-center font-extrabold text-xs tracking-wider">ព័ត៌មានអាហារូបត្ថម្ភ / Nutrition</div>
                <div className="text-[9px] text-center border-b border-black pb-0.5">ទំហំនៃការបម្រើ / Serving Size: {weight}</div>
                
                <div className="flex flex-col text-[10px] gap-0.5 mt-1">
                  <div className="flex justify-between font-bold border-b border-slate-100">
                    <span>ថាមពល / Calories</span>
                    <span>{labelData.nutritionFacts.calories} kcal</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100">
                    <span>ជាតិខ្លាញ់ / Total Fat</span>
                    <span>{labelData.nutritionFacts.fat}g</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100">
                    <span>កាបូអ៊ីដ្រាត / Carbs</span>
                    <span>{labelData.nutritionFacts.carbs}g</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100">
                    <span>ប្រូតេអ៊ីន / Protein</span>
                    <span>{labelData.nutritionFacts.protein}g</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100">
                    <span>សូដ្យូម / Sodium</span>
                    <span>{labelData.nutritionFacts.sodium}mg</span>
                  </div>
                </div>
              </div>

              {/* Ingredients List */}
              <div className="border-t border-black pt-1 flex flex-col gap-0.5">
                <div className="font-extrabold text-[9px]">គ្រឿងផ្សំ / Ingredients:</div>
                <div className="text-[9px] leading-tight font-sans">
                  {labelData.ingredients.map(i => `${i.nameKh} (${i.percentage}%)`).join(', ')}
                </div>
              </div>

              {/* Allergens warning if any */}
              {labelData.allergensKh.length > 0 && (
                <div className="border border-red-500 bg-red-50 p-1 rounded text-[8px] leading-tight flex items-start gap-1">
                  <AlertTriangle className="text-red-500 shrink-0" size={10} />
                  <div>
                    <strong className="text-red-700">អាឡែហ្ស៊ី / Allergens:</strong><br />
                    {labelData.allergensKh.join(', ')}
                  </div>
                </div>
              )}

              {/* Warnings */}
              <div className="border-t border-black pt-1 text-center text-[8px] font-semibold text-red-600">
                {labelData.mandatoryWarningsKh.join('. ')}
              </div>

              {/* Barcode SVG */}
              <div className="border-t border-black pt-2 flex justify-center">
                <svg ref={barcodeRef} id="barcode"></svg>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Economics & Print Queue (lg:col-span-4) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Unit Economics Calculator */}
          <div className="glass p-6 rounded-2xl flex flex-col gap-4 text-left">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <Layers size={18} className="text-amber" /> Co-op Unit Economics
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-light/70">PackCo Aggregated Cost:</span>
                <span className="text-sm font-bold text-green-400">$0.16 / unit</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-light/70">Maker Retail Price (100 MOQ):</span>
                <span className="text-sm font-bold text-white">$0.25 / unit</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-xs text-slate-light/70">PackCo Platform Margin:</span>
                <span className="text-sm font-bold text-amber">36% ($0.09)</span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-slate-light/70">DIY Paper Sticker Cost:</span>
                <span className="text-sm text-slate-light/50 line-through">$0.26 / unit</span>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-[11px] text-green-400 leading-relaxed">
                <strong>Saving:</strong> You save 38% on manual labor and print custom waterproof, legally compliant food bags.
              </div>
            </div>
          </div>

          {/* Co-op Print Queue Simulator */}
          <div className="glass p-6 rounded-2xl flex flex-col gap-4 text-left">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-3">Co-op Print Queue</h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white">Matte Kraft Pouch (100g)</span>
                  <span className="text-slate-light/60">3,450 / 5,000 units</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy/60 overflow-hidden">
                  <div className="h-full bg-amber rounded-full" style={{ width: '69%' }}></div>
                </div>
                <span className="text-[10px] text-slate-light/50">Needs 1,550 units to pool and print.</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white">Shiny Foil Pouch (250g)</span>
                  <span className="text-slate-light/60">4,800 / 5,000 units</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy/60 overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: '96%' }}></div>
                </div>
                <span className="text-[10px] text-green-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Almost full! Print run triggers soon.
                </span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Hidden container specifically styled for clean PDF prints */}
      <div className="hidden print:block label-print-container bg-white text-black p-6 border border-black max-w-[240px] font-sans">
        <div className="text-center font-outfit font-extrabold text-sm border-b-2 border-black pb-1.5 uppercase tracking-wide">
          PackCo Compliance
        </div>
        <div className="text-center mt-2">
          <div className="font-bold text-base leading-tight font-sans">{labelData.productNameKhmer || labelData.productName}</div>
          <div className="text-[9px] text-slate-dark italic leading-none">{productName}</div>
        </div>
        <div className="border-t border-black pt-1 mt-2">
          <div className="text-center font-extrabold text-xs tracking-wider">ព័ត៌មានអាហារូបត្ថម្ភ / Nutrition</div>
          <div className="text-[8px] text-center border-b border-black pb-0.5">ទំហំនៃការបម្រើ / Serving Size: {weight}</div>
          <div className="flex flex-col text-[10px] gap-0.5 mt-1">
            <div className="flex justify-between font-bold border-b border-slate-100">
              <span>ថាមពល / Calories</span>
              <span>{labelData.nutritionFacts.calories} kcal</span>
            </div>
            <div className="flex justify-between border-b border-slate-100">
              <span>ជាតិខ្លាញ់ / Total Fat</span>
              <span>{labelData.nutritionFacts.fat}g</span>
            </div>
            <div className="flex justify-between border-b border-slate-100">
              <span>កាបូអ៊ីដ្រាត / Carbs</span>
              <span>{labelData.nutritionFacts.carbs}g</span>
            </div>
            <div className="flex justify-between border-b border-slate-100">
              <span>ប្រូតេអ៊ីន / Protein</span>
              <span>{labelData.nutritionFacts.protein}g</span>
            </div>
            <div className="flex justify-between border-b border-slate-100">
              <span>សូដ្យូម / Sodium</span>
              <span>{labelData.nutritionFacts.sodium}mg</span>
            </div>
          </div>
        </div>
        <div className="border-t border-black pt-1 mt-2 flex flex-col gap-0.5">
          <div className="font-extrabold text-[8px]">គ្រឿងផ្សំ / Ingredients:</div>
          <div className="text-[8px] leading-tight font-sans">
            {labelData.ingredients.map(i => `${i.nameKh} (${i.percentage}%)`).join(', ')}
          </div>
        </div>
        {labelData.allergensKh.length > 0 && (
          <div className="border border-red-500 bg-red-50 p-1 rounded text-[8px] leading-tight mt-1 flex items-start gap-1">
            <div className="text-red-700 font-bold">អាឡែហ្ស៊ី / Allergens:</div>
            <div>{labelData.allergensKh.join(', ')}</div>
          </div>
        )}
        <div className="border-t border-black pt-1 mt-2 text-center text-[8px] font-semibold text-red-600">
          {labelData.mandatoryWarningsKh.join('. ')}
        </div>
        <div className="border-t border-black pt-2 mt-2 flex justify-center">
          <svg ref={barcodeRef}></svg>
        </div>
      </div>
    </div>
  );
}
