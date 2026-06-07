import React from 'react';

// Modern Minimal — editorial, lots of whitespace, premium feel.
export default function LabelTemplateModern({ labelData, productName, weight, expiry, customLogoSvg, customLogoUrl }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];
  const productNameKh = labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល';

  const Logo = () =>
    customLogoSvg ? (
      <div className="w-14 h-14 flex items-center justify-center shrink-0" dangerouslySetInnerHTML={{ __html: customLogoSvg }} />
    ) : customLogoUrl ? (
      <img src={customLogoUrl} alt="Brand Logo" className="w-14 h-14 object-contain shrink-0 mix-blend-multiply" />
    ) : (
      <div className="w-14 h-14 rounded-full border-2 border-amber-400 shrink-0" />
    );

  return (
    <div className="w-full max-w-[800px] bg-white text-slate-900 p-7 rounded-2xl shadow-2xl border border-slate-200 font-sans select-none label-print-container min-h-[400px] flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="flex flex-col">
            <span className="text-[9px] font-black tracking-[0.3em] text-amber-600 uppercase">Khmer Co·op</span>
            <h1 className="text-2xl font-black font-khmer leading-tight text-slate-950">{productNameKh}</h1>
            {productName && <span className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">{productName}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400">Net Weight</span>
          <span className="text-2xl font-black text-slate-900">{weight || '100g'}</span>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-amber-400 via-orange-400 to-transparent" />

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left: ingredients + allergens */}
        <div className="md:col-span-3 flex flex-col gap-4 text-left">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">គ្រឿងផ្សំ / Ingredients</h4>
            <p className="text-[12px] font-khmer text-slate-700 leading-relaxed">
              {ingredients.length > 0
                ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
                : 'មិនមានព័ត៌មានគ្រឿងផ្សំ'}
            </p>
          </div>

          {allergens.length > 0 && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-[10px] text-amber-900 font-khmer">
              <strong className="uppercase tracking-wide text-amber-700">ព័ត៌មានអាឡែហ្ស៊ី / Allergens: </strong>
              {allergens.join(', ')}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-[10px] mt-auto">
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">ផលិត / Mfg</span>
              <span className="font-mono text-slate-800">07/06/2026</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">ផុតកំណត់ / Expiry</span>
              <span className="font-mono text-slate-800">{expiry || '6 Months'}</span>
            </div>
          </div>
        </div>

        {/* Right: nutrition card */}
        <div className="md:col-span-2">
          <div className="rounded-xl border border-slate-900 overflow-hidden">
            <div className="bg-slate-900 text-white text-center py-1.5 text-[10px] font-black uppercase tracking-wider">
              Nutrition / អាហារូបត្ថម្ភ
            </div>
            <div className="flex justify-between text-[9px] px-3 py-1 border-b border-slate-200 font-semibold text-slate-600">
              <span>Serving / ការបម្រើ</span><span>{weight || '100g'}</span>
            </div>
            {[
              { k: 'Calories', v: `${nutrition.calories || 0} kcal`, b: true },
              { k: 'Total Fat', v: `${nutrition.fat || 0}g` },
              { k: 'Carbs', v: `${nutrition.carbs || 0}g` },
              { k: 'Protein', v: `${nutrition.protein || 0}g` },
              { k: 'Sodium', v: `${nutrition.sodium || 0}mg` },
            ].map((r, i) => (
              <div key={i} className={`flex justify-between px-3 py-1 text-[11px] ${i < 4 ? 'border-b border-slate-100' : ''} ${r.b ? 'font-black' : 'font-medium text-slate-700'}`}>
                <span>{r.k}</span><span>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {warnings.length > 0 && (
        <div className="text-center text-[10px] font-bold font-khmer text-red-600">{warnings.join('. ')}</div>
      )}

      {/* Footer */}
      <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-3">
        <svg className="barcode-svg max-h-[40px] max-w-[180px]"></svg>
        <div className="flex items-center gap-2 text-sm opacity-50">
          <span>♻️</span><span>🚯</span><span>🍽️</span>
          <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500 ml-1">Product of Cambodia</span>
        </div>
      </div>
    </div>
  );
}
