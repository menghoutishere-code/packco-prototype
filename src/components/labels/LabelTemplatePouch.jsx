import React from 'react';

export default function LabelTemplatePouch({ labelData, productName, weight, expiry, customLogoSvg, customLogoUrl }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];

  return (
    <div className="w-full max-w-[800px] bg-white text-slate-950 p-6 border-4 border-slate-900 rounded-xl shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 font-sans select-none relative overflow-hidden label-print-container min-h-[400px]">
      {/* Wave pattern top boundary band */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500"></div>

      {/* Decorative Wave/Scale Background Pattern (rendered behind the center panel) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle at 100% 150%, currentColor 24%, transparent 25%), 
                          radial-gradient(circle at 0% 150%, currentColor 24%, transparent 25%), 
                          radial-gradient(circle at 50% 100%, currentColor 24%, transparent 25%)`,
        backgroundSize: '24px 24px',
        color: '#f59e0b'
      }}></div>

      {/* LEFT COLUMN: Compliance & Sourcing */}
      <div className="flex flex-col justify-between gap-4 border-r border-slate-200 pr-4 md:border-b-0 border-b pb-4 md:pb-0">
        <div className="flex flex-col gap-3">
          <div className="text-[9px] font-black tracking-widest text-slate-400 uppercase">PRODUCT OF CAMBODIA</div>
          
          <div className="flex flex-col gap-1 text-left">
            <h4 className="font-extrabold text-[10px] text-slate-800 uppercase tracking-wider">
              គ្រឿងផ្សំ / Ingredients
            </h4>
            <p className="text-[10px] font-khmer text-slate-700 leading-relaxed">
              {ingredients.length > 0
                ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
                : 'មិនមានព័ត៌មានគ្រឿងផ្សំ'}
            </p>
          </div>

          {/* Allergen Warning Box */}
          {allergens.length > 0 && (
            <div className="border border-amber-500 bg-amber-50/70 p-2 rounded text-[9px] text-amber-950 font-khmer leading-snug">
              <strong className="text-amber-800 uppercase tracking-wider block mb-0.5">ព័ត៌មានអាឡែហ្ស៊ី / Allergen Alert</strong>
              {allergens.join(', ')}
            </div>
          )}
        </div>

        {/* Barcode & Volume */}
        <div className="flex flex-col items-center gap-2 border-t border-slate-100 pt-3">
          <svg className="barcode-svg max-h-[42px] max-w-full"></svg>
          <div className="text-[9px] font-bold text-slate-600 uppercase tracking-wider">
            Net Weight / ទម្ងន់សុទ្ធ: {weight || '100g'}
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Brand identity & Hero artwork */}
      <div className="flex flex-col justify-between items-center text-center py-2 relative z-10 md:border-b-0 border-b pb-4 md:pb-0">
        <div className="w-full flex flex-col items-center gap-1">
          <div className="text-[9px] tracking-[0.25em] text-slate-500 uppercase font-black">KHMER CO-OP</div>
          <div className="w-10 h-0.5 bg-amber-500 my-1"></div>
        </div>

        {/* Dynamic Graphic/Illustration (from Gemini Logo API) */}
        <div className="flex justify-center items-center my-4 min-h-[100px] w-full max-h-[110px] overflow-hidden">
          {customLogoSvg ? (
            <div className="w-24 h-24 flex items-center justify-center svg-logo-container" dangerouslySetInnerHTML={{ __html: customLogoSvg }} />
          ) : customLogoUrl ? (
            <img src={customLogoUrl} alt="Brand Logo" className="w-24 h-24 object-contain mix-blend-multiply" />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
              No Logo Applied
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1.5 mt-2">
          <h1 className="text-2xl font-black font-khmer text-slate-950 leading-tight tracking-normal">
            {labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល'}
          </h1>
          {productName && (
            <p className="text-xs font-bold text-slate-600 uppercase tracking-widest font-sans">
              {productName}
            </p>
          )}
          <span className="text-[9px] text-amber-600 uppercase tracking-[0.2em] font-black mt-1">
            GUT FRIENDLY · 100% ORGANIC
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Nutrition Facts & Warnings */}
      <div className="flex flex-col justify-between gap-4 border-l border-slate-200 pl-4">
        {/* Bilingual Nutrition Panel */}
        <div className="border-2 border-slate-950 p-2 rounded bg-white">
          <div className="text-center font-extrabold text-[11px] border-b-2 border-slate-950 pb-0.5 uppercase tracking-wider">
            Nutrition Facts / ព័ត៌មានអាហារូបត្ថម្ភ
          </div>
          <div className="flex justify-between text-[8px] border-b border-slate-400 py-0.5 font-semibold">
            <span>Serving Size / ទំហំនៃការបម្រើ:</span>
            <span>{weight || '100g'}</span>
          </div>

          <div className="flex flex-col text-[10px] gap-0.5 mt-1 font-sans">
            <div className="flex justify-between font-bold border-b border-slate-100 pb-0.5">
              <span>Calories / ថាមពល</span>
              <span>{nutrition.calories || 0} kcal</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span>Total Fat / ជាតិខ្លាញ់សរុប</span>
              <span>{nutrition.fat || 0}g</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span>Carbs / កាបូអ៊ីដ្រាត</span>
              <span>{nutrition.carbs || 0}g</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-0.5">
              <span>Protein / ប្រូតេអ៊ីន</span>
              <span>{nutrition.protein || 0}g</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span>Sodium / សូដ្យូម</span>
              <span>{nutrition.sodium || 0}mg</span>
            </div>
          </div>
        </div>

        {/* Dates, Warnings & Regulatory symbols */}
        <div className="flex flex-col gap-2">
          {/* Expiry Card */}
          <div className="grid grid-cols-2 gap-2 text-[8px] text-slate-500 font-semibold border-t border-slate-100 pt-2">
            <div>
              <span className="block text-[7px] uppercase tracking-wider text-slate-400">Mfg Date / ថ្ងៃផលិត</span>
              <span className="text-slate-900 font-mono">07/06/2026</span>
            </div>
            <div>
              <span className="block text-[7px] uppercase tracking-wider text-slate-400">Exp Date / ថ្ងៃផុតកំណត់</span>
              <span className="text-slate-900 font-mono">{expiry || '6 Months'}</span>
            </div>
          </div>

          {/* Warnings & Storage */}
          {warnings.length > 0 && (
            <div className="text-center text-[8px] font-bold font-khmer text-red-600 leading-normal border-t border-slate-100 pt-1.5">
              {warnings.join('. ')}
            </div>
          )}

          {/* Keep Cambodian clean logo row */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-2 text-[10px] opacity-60">
            <span>♻️ 🚯 🍽️</span>
            <span className="text-[8px] font-bold uppercase tracking-wider">Premium Quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}
