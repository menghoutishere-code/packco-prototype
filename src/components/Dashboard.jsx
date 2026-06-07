import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { LogOut, RefreshCw, FileDown, AlertTriangle, Layers, Check, Globe, Layout, Sparkles } from 'lucide-react';
import LabelTemplatePouch from './labels/LabelTemplatePouch';
import LabelTemplateKraft from './labels/LabelTemplateKraft';
import LabelTemplatePanel from './labels/LabelTemplatePanel';
import LabelTemplateModern from './labels/LabelTemplateModern';
import LabelTemplateVibrant from './labels/LabelTemplateVibrant';
import LogoStudio from './LogoStudio';
import MockupStudio from './MockupStudio';

export default function Dashboard({ onLogout }) {
  const [productName, setProductName] = useState('Dried Spicy Mango');
  const [rawIngredients, setRawIngredients] = useState('Ripe Mango 85%, Sugar 12%, Chili 3%');
  const [weight, setWeight] = useState('100g');
  const [expiry, setExpiry] = useState('6 months');
  const [barcodeText, setBarcodeText] = useState('8841234567890');
  const [inputLanguage, setInputLanguage] = useState('en'); // 'en' or 'km'
  const [activeTemplate, setActiveTemplate] = useState('modern'); // modern, vibrant, pouch, kraft, panel
  const [isEconomicsOpen, setIsEconomicsOpen] = useState(true); // Open by default to show details
  const [isLiabilityChecked, setIsLiabilityChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionInput, setNutritionInput] = useState({
    calories: 340,
    fat: 1.2,
    carbs: 82.0,
    protein: 1.5,
    sodium: 180
  });

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

  const [activeTab, setActiveTab] = useState('label'); // 'label', 'logo', 'mockup'
  const [customLogoSvg, setCustomLogoSvg] = useState(null);
  const [customLogoUrl, setCustomLogoUrl] = useState(null);

  const handleApplyLogo = (svgCode, imgUrl) => {
    setCustomLogoSvg(svgCode);
    setCustomLogoUrl(imgUrl);
    setActiveTab('label');
  };

  // Sync local nutrition inputs when labelData changes from API
  useEffect(() => {
    if (labelData && labelData.nutritionFacts) {
      setNutritionInput({
        calories: labelData.nutritionFacts.calories || 0,
        fat: labelData.nutritionFacts.fat || 0,
        carbs: labelData.nutritionFacts.carbs || 0,
        protein: labelData.nutritionFacts.protein || 0,
        sodium: labelData.nutritionFacts.sodium || 0
      });
    }
  }, [labelData]);

  // Sync changes to nutritionInput back to labelData so templates update in real time
  const handleNutritionChange = (key, val) => {
    const numericVal = parseFloat(val) || 0;
    setNutritionInput(prev => ({ ...prev, [key]: val }));
    setLabelData(prev => ({
      ...prev,
      nutritionFacts: {
        ...prev.nutritionFacts,
        [key]: numericVal
      }
    }));
  };

  // Render barcode whenever barcodeText or activeTemplate changes
  useEffect(() => {
    const renderBarcodes = () => {
      const els = document.querySelectorAll('.barcode-svg');
      if (els.length > 0 && barcodeText) {
        els.forEach(el => {
          try {
            JsBarcode(el, barcodeText, {
              format: "EAN13",
              width: 1.2,
              height: 35,
              displayValue: true,
              fontSize: 9,
              margin: 0,
              background: "transparent"
            });
          } catch (err) {
            try {
              JsBarcode(el, barcodeText, {
                format: "CODE128",
                width: 1.2,
                height: 35,
                displayValue: true,
                fontSize: 9,
                margin: 0,
                background: "transparent"
              });
            } catch (e) {
              console.error("Barcode rendering failed", e);
            }
          }
        });
      }
    };

    renderBarcodes();
    const timer = setTimeout(renderBarcodes, 50);
    return () => clearTimeout(timer);
  }, [barcodeText, labelData, activeTemplate]);

  // Adjust placeholder suggestions based on input language
  useEffect(() => {
    if (inputLanguage === 'km') {
      setProductName('ស្វាយសម្ងួតហឹរ');
      setRawIngredients('ស្វាយទុំ ៨៥%, ស្ករស ១២%, ម្ទេស ៣%');
    } else {
      setProductName('Dried Spicy Mango');
      setRawIngredients('Ripe Mango 85%, Sugar 12%, Chili 3%');
    }
  }, [inputLanguage]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rawInput: `Product: ${productName}, Ingredients: ${rawIngredients}, Weight: ${weight}, Expiry: ${expiry}`,
          inputLanguage 
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setLabelData(data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn("API request failed, running offline mock fallback", err);
      // Fallback offline mock processing
      setTimeout(() => {
        const parsedIngs = rawIngredients.split(/[,、|]/).map(item => {
          const trimmed = item.trim();
          const match = trimmed.match(/(.*?)\s*(\d+)\s*%/);
          const name = match ? match[1] : trimmed;
          const pct = match ? parseInt(match[2]) : 10;
          return { nameKh: inputLanguage === 'km' ? name : translateMockIng(name), percentage: pct };
        });

        setLabelData({
          productNameKh: inputLanguage === 'km' ? productName : translateMockName(productName),
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
      }, 1200);
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
    return name;
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

  const renderSelectedTemplate = () => {
    const props = {
      labelData,
      productName,
      weight,
      expiry,
      customLogoSvg,
      customLogoUrl
    };

    switch (activeTemplate) {
      case 'kraft':
        return <LabelTemplateKraft {...props} />;
      case 'panel':
        return <LabelTemplatePanel {...props} />;
      case 'modern':
        return <LabelTemplateModern {...props} />;
      case 'vibrant':
        return <LabelTemplateVibrant {...props} />;
      case 'pouch':
      default:
        return <LabelTemplatePouch {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex flex-col font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-4 flex justify-between items-center border-b border-white/5 no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-outfit text-white font-extrabold text-lg shadow-lg">P</div>
          <span className="font-outfit text-lg font-bold text-white tracking-tight">PackCo<span className="text-amber-500">.ai</span></span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-semibold uppercase">Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400">Logged in as: <strong>admin</strong></span>
          <button 
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-all duration-200 border border-white/10 flex items-center gap-2"
          >
            <LogOut size={14} /> Log Out
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-navy/40 border-b border-white/5 no-print">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setActiveTab('label')}
            className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'label'
                ? 'border-amber-500 text-amber-500 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layout size={14} /> Label Studio
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'logo'
                ? 'border-amber-500 text-amber-500 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} /> Brand Logo Studio
          </button>
          <button
            onClick={() => setActiveTab('mockup')}
            className={`px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'mockup'
                ? 'border-amber-500 text-amber-500 bg-white/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers size={14} /> 3D Mockup Studio
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 no-print">
        {activeTab === 'label' && (
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Panel (1/3 size - lg:col-span-4) */}
        <section className="lg:col-span-4 flex flex-col gap-6 text-left">
          <div className="glass p-6 rounded-2xl flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles size={16} className="text-amber-500" /> Input Parameters
              </h2>
              
              {/* Language Switch */}
              <div className="flex bg-navy rounded-lg p-0.5 border border-white/5">
                <button
                  onClick={() => setInputLanguage('en')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${inputLanguage === 'en' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => setInputLanguage('km')}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${inputLanguage === 'km' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🇰🇭 ខ្មែរ
                </button>
              </div>
            </div>
            
            {/* Form Fields */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                {inputLanguage === 'km' ? 'ឈ្មោះផលិតផល' : 'Product Name'}
              </label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={inputLanguage === 'km' ? 'ឧទាហរណ៍៖ ស្វាយសម្ងួត' : 'e.g. Dried Spicy Mango'}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber-500/40 text-white text-sm outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                {inputLanguage === 'km' ? 'គ្រឿងផ្សំ និង ភាគរយ' : 'Ingredients & percentages'}
              </label>
              <textarea 
                rows={3}
                value={rawIngredients}
                onChange={(e) => setRawIngredients(e.target.value)}
                placeholder={inputLanguage === 'km' ? 'ឧទាហរណ៍៖ ស្វាយទុំ ៨៥%, ស្ករស ១២%' : 'e.g. Ripe Mango 85%, Sugar 12%'}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber-500/40 text-white text-sm outline-none transition-all resize-none"
              />
              <span className="text-[10px] text-slate-500">
                {inputLanguage === 'km' ? 'បំបែកគ្រឿងផ្សំដោយសញ្ញាក្បៀស (,)' : 'Separate ingredients with commas (,)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {inputLanguage === 'km' ? 'ទម្ងន់សុទ្ធ' : 'Net Weight'}
                </label>
                <input 
                  type="text" 
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber-500/40 text-white text-sm outline-none transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {inputLanguage === 'km' ? 'រយៈពេលផុតកំណត់' : 'Expiry Period'}
                </label>
                <input 
                  type="text" 
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber-500/40 text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300">
                {inputLanguage === 'km' ? 'តម្លៃបារកូដ GS1 (EAN-13 សម្រាប់ទីតាំង/FPO)' : 'GS1 Barcode (EAN-13 Placeholder / FPO)'}
              </label>
              <input 
                type="text" 
                value={barcodeText}
                onChange={(e) => setBarcodeText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-navy/50 border border-white/5 focus:border-amber-500/40 text-white text-sm outline-none transition-all"
              />
            </div>

            {/* Nutrition Inputs */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-3">
              <label className="text-xs font-bold text-slate-300">
                {inputLanguage === 'km' ? 'តម្លៃអាហារូបត្ថម្ភ (ក្នុង ១០០ក្រាម)' : 'Nutrition Facts (per 100g)'}
              </label>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400">Calories (kcal)</span>
                  <input 
                    type="number" 
                    value={nutritionInput.calories} 
                    onChange={(e) => handleNutritionChange('calories', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-navy/50 border border-white/5 text-white text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400">Sodium (mg)</span>
                  <input 
                    type="number" 
                    value={nutritionInput.sodium} 
                    onChange={(e) => handleNutritionChange('sodium', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-navy/50 border border-white/5 text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400">Fat (g)</span>
                  <input 
                    type="number" 
                    step="0.1"
                    value={nutritionInput.fat} 
                    onChange={(e) => handleNutritionChange('fat', e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-navy/50 border border-white/5 text-white text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400">Carbs (g)</span>
                  <input 
                    type="number" 
                    value={nutritionInput.carbs} 
                    onChange={(e) => handleNutritionChange('carbs', e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-navy/50 border border-white/5 text-white text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-slate-400">Protein (g)</span>
                  <input 
                    type="number" 
                    step="0.1"
                    value={nutritionInput.protein} 
                    onChange={(e) => handleNutritionChange('protein', e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-navy/50 border border-white/5 text-white text-xs outline-none"
                  />
                </div>
              </div>
              <span className="text-[9px] text-slate-500 italic mt-0.5">
                * Automatically estimated by AI based on ingredients. You can manually adjust values here.
              </span>
            </div>

            {/* Maker Liability Checkbox */}
            <div className="flex items-start gap-2 border-t border-white/5 pt-3 mt-1">
              <input 
                type="checkbox" 
                id="liability-checkbox"
                checked={isLiabilityChecked}
                onChange={(e) => setIsLiabilityChecked(e.target.checked)}
                className="mt-1 rounded bg-navy border-white/10 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="liability-checkbox" className="text-[10px] text-slate-400 leading-snug cursor-pointer select-none">
                {inputLanguage === 'km' 
                  ? 'ខ្ញុំបញ្ជាក់ថា គ្រឿងផ្សំ និងទម្ងន់គឺត្រឹមត្រូវ។ ទំនួលខុសត្រូវចុងក្រោយសម្រាប់ការអនុលោមតាមសេចក្តីសម្រេច ១១២ គឺស្ថិតនៅលើសហគ្រាសផលិត។'
                  : 'I verify that ingredients, allergens, and weights are correct. Final compliance sign-off under Sub-Decree 112 rests with the producer.'
                }
              </label>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isLoading || !isLiabilityChecked}
              className={`mt-2 w-full py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-sm ${
                isLiabilityChecked 
                  ? 'bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-orange-500 hover:to-amber-500 text-white shadow-amber-500/20' 
                  : 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Generating Compliance...
                </>
              ) : (
                <>
                  Generate Label Compliance
                </>
              )}
            </button>
          </div>

          {/* Unit Economics - Collapsible Card */}
          <div className="glass rounded-2xl overflow-hidden">
            <button 
              onClick={() => setIsEconomicsOpen(!isEconomicsOpen)}
              className="w-full p-4 flex justify-between items-center text-left hover:bg-white/5 transition-all"
            >
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-amber-500" /> Co-op Unit Economics
              </span>
              <span className="text-xs text-slate-400">{isEconomicsOpen ? 'Hide' : 'Show'}</span>
            </button>
            
            {isEconomicsOpen && (
              <div className="p-5 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">PackCo Aggregated Cost:</span>
                  <span className="font-bold text-green-400">$0.16 / unit</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Maker Retail Price (100 MOQ):</span>
                  <span className="font-bold text-white">$0.25 / unit</span>
                </div>
                <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                  <span className="text-slate-400">Local Delivery (Flat Grab Rate):</span>
                  <span className="font-bold text-slate-300">$1.50 / order</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">PackCo Platform Margin:</span>
                  <span className="font-bold text-amber-500">36% ($0.09)</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Scheduled Printing Drop:</span>
                  <span className="font-bold text-orange-400">15th & 30th Monthly</span>
                </div>
                
                <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/10 text-[10px] text-green-400 leading-normal">
                  <strong>Batch Drop Model:</strong> Pre-order slots to lock into the upcoming scheduled print drop. Flat delivery covered by the maker.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Preview & Template Selector (2/3 size - lg:col-span-8) */}
        <section className="lg:col-span-8 flex flex-col gap-6 items-center">
          <div className="w-full glass p-6 rounded-2xl flex flex-col gap-6 text-left">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layout size={18} className="text-amber-500" /> Compliance Studio
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Select a template to preview and export your compliant label.</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                >
                  <FileDown size={14} /> Export Label (PDF)
                </button>
              </div>
            </div>

            {/* Template Selector Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'modern', name: '✨ Modern Minimal', desc: 'Editorial, clean whitespace' },
                { id: 'vibrant', name: '🔥 Vibrant Market', desc: 'Bold gradient, nutrition pills' },
                { id: 'pouch', name: '🍊 Pouch Label', desc: 'Accent band, bilingual table' },
                { id: 'kraft', name: '🌾 Premium Kraft', desc: 'Artisan minimal, warm tone' },
                { id: 'panel', name: '📜 Back Panel', desc: 'Structured FDA layout' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${activeTemplate === t.id ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5' : 'bg-navy/30 border-white/5 hover:border-white/10'}`}
                >
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{t.desc}</div>
                </button>
              ))}
            </div>

            {/* Large Label Preview Area */}
            <div className="flex-1 min-h-[420px] bg-navy-dark/40 rounded-xl border border-white/5 flex items-center justify-center p-6 relative overflow-auto">
              <div className="absolute top-3 left-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
                Label Canvas Preview
              </div>
              
              {renderSelectedTemplate()}
            </div>
          </div>
        </section>

          </main>
        )}

        {activeTab === 'logo' && (
          <LogoStudio 
            productName={productName} 
            onApplyLogo={handleApplyLogo} 
          />
        )}

        {activeTab === 'mockup' && (
          <MockupStudio 
            labelData={labelData} 
            productName={productName} 
            weight={weight} 
            expiry={expiry} 
            barcodeText={barcodeText} 
            activeTemplate={activeTemplate} 
            customLogoSvg={customLogoSvg}
            customLogoUrl={customLogoUrl}
          />
        )}
      </div>

      {/* Hidden print container for high-quality export */}
      <div className="hidden print:block">
        {renderSelectedTemplate()}
      </div>
    </div>
  );
}
