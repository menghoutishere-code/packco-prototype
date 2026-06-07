import React from 'react';

export default function LabelTemplatePouch({ labelData, productName, weight, expiry }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];

  return (
    <div className="w-full max-w-[320px] bg-white text-black p-5 border-4 border-double border-slate-900 rounded-lg shadow-2xl flex flex-col gap-4 font-sans select-none relative overflow-hidden label-print-container">
      {/* Top Category Accent Band (Bespoke Brand Style) */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500"></div>
      
      {/* Brand Header */}
      <div className="text-center mt-2 border-b-2 border-slate-900 pb-2">
        <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 font-extrabold">PACKCO COMPLIANCE</div>
        <h1 className="text-xl font-black font-khmer text-slate-950 mt-1 leading-tight tracking-normal">
          {labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល'}
        </h1>
        {productName && (
          <p className="text-xs font-semibold text-slate-600 italic tracking-wider font-sans mt-0.5">
            {productName}
          </p>
        )}
      </div>

      {/* Origin Badge */}
      <div className="text-center py-0.5 px-2 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
        ផលិតផលខ្មែរ / Product of Cambodia
      </div>

      {/* Bilingual Nutrition Panel */}
      <div className="border-2 border-slate-950 p-2.5 rounded bg-white">
        <div className="text-center font-extrabold text-sm border-b-2 border-slate-950 pb-1 uppercase tracking-wider">
          ព័ត៌មានអាហារូបត្ថម្ភ / Nutrition Facts
        </div>
        <div className="flex justify-between text-[10px] border-b border-slate-400 py-1 font-semibold">
          <span>ទំហំនៃការបម្រើ / Serving Size:</span>
          <span>{weight || '100g'}</span>
        </div>
        
        {/* Table Headings */}
        <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-wider pt-1 border-b border-slate-200">
          <span>សារធាតុចិញ្ចឹម / Nutrients</span>
          <span>បរិមាណ / Amount</span>
        </div>

        <div className="flex flex-col text-[11px] gap-1 mt-1 font-sans">
          <div className="flex justify-between font-bold border-b border-slate-200 pb-0.5">
            <span className="font-khmer text-[10px]">ថាមពល / <span className="font-sans text-[11px]">Calories</span></span>
            <span>{nutrition.calories || 0} kcal</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-0.5">
            <span className="font-khmer text-[10px]">ជាតិខ្លាញ់សរុប / <span className="font-sans text-[11px]">Total Fat</span></span>
            <span>{nutrition.fat || 0}g</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-0.5">
            <span className="font-khmer text-[10px]">កាបូអ៊ីដ្រាត / <span className="font-sans text-[11px]">Carbs</span></span>
            <span>{nutrition.carbs || 0}g</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-0.5">
            <span className="font-khmer text-[10px]">ប្រូតេអ៊ីន / <span className="font-sans text-[11px]">Protein</span></span>
            <span>{nutrition.protein || 0}g</span>
          </div>
          <div className="flex justify-between pb-0.5">
            <span className="font-khmer text-[10px]">សូដ្យូម / <span className="font-sans text-[11px]">Sodium</span></span>
            <span>{nutrition.sodium || 0}mg</span>
          </div>
        </div>
      </div>

      {/* Ingredients Section */}
      <div className="border-t border-slate-350 pt-2 text-left">
        <h4 className="font-extrabold text-[10px] text-slate-800 uppercase tracking-wider">
          គ្រឿងផ្សំ / Ingredients
        </h4>
        <p className="text-[10px] font-khmer text-slate-700 mt-1 leading-relaxed">
          {ingredients.length > 0
            ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
            : 'មិនមានព័ត៌មានគ្រឿងផ្សំ'}
        </p>
      </div>

      {/* Dates Row */}
      <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-2 text-[9px] text-slate-600 font-semibold">
        <div>
          <span className="block text-[8px] uppercase tracking-wider text-slate-400">Mfg Date / ថ្ងៃផលិត</span>
          <span className="text-slate-900 font-mono">07/06/2026</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase tracking-wider text-slate-400">Exp Date / កាលបរិច្ឆេទផុតកំណត់</span>
          <span className="text-slate-900 font-mono">{expiry || '6 Months'}</span>
        </div>
      </div>

      {/* Allergen Warning Box */}
      {allergens.length > 0 && (
        <div className="border border-amber-500 bg-amber-50/70 p-2 rounded text-[9px] text-amber-950 font-khmer leading-snug">
          <strong className="text-amber-800 uppercase tracking-wider block mb-0.5">ព័ត៌មានអាឡែហ្ស៊ី / Allergen Alert</strong>
          {allergens.join(', ')}
        </div>
      )}

      {/* Warnings & Storage */}
      {warnings.length > 0 && (
        <div className="border-t border-slate-200 pt-2 text-center text-[9px] font-bold font-khmer text-red-600 leading-normal">
          {warnings.join('. ')}
        </div>
      )}

      {/* Barcode Section */}
      <div className="border-t border-slate-200 pt-3 flex flex-col items-center">
        <svg className="barcode-svg max-h-[50px] max-w-full"></svg>
      </div>
    </div>
  );
}
