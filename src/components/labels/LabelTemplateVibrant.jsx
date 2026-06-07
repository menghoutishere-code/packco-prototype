import React from 'react';

// Vibrant Market — bold gradient header, colourful nutrition pills, snack-brand energy.
export default function LabelTemplateVibrant({ labelData, productName, weight, expiry, customLogoSvg, customLogoUrl }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];
  const productNameKh = labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល';

  const stats = [
    { k: 'ថាមពល', e: 'Cal', v: `${nutrition.calories || 0}`, u: 'kcal', c: 'bg-orange-500' },
    { k: 'ខ្លាញ់', e: 'Fat', v: `${nutrition.fat || 0}`, u: 'g', c: 'bg-amber-500' },
    { k: 'កាបូ', e: 'Carbs', v: `${nutrition.carbs || 0}`, u: 'g', c: 'bg-yellow-500' },
    { k: 'ប្រូតេអ៊ីន', e: 'Protein', v: `${nutrition.protein || 0}`, u: 'g', c: 'bg-lime-600' },
    { k: 'សូដ្យូម', e: 'Sodium', v: `${nutrition.sodium || 0}`, u: 'mg', c: 'bg-rose-500' },
  ];

  return (
    <div className="w-full max-w-[800px] bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden font-sans select-none label-print-container min-h-[400px] flex flex-col">
      {/* Gradient header */}
      <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 px-7 py-5 text-white flex items-center gap-4">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }} />
        {(customLogoSvg || customLogoUrl) && (
          <div className="relative w-16 h-16 rounded-full bg-white/95 p-1.5 shadow-lg shrink-0 flex items-center justify-center">
            {customLogoSvg
              ? <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: customLogoSvg }} />
              : <img src={customLogoUrl} alt="Brand Logo" className="w-full h-full object-contain" />}
          </div>
        )}
        <div className="relative flex flex-col">
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/80">Khmer Co·op</span>
          <h1 className="text-3xl font-black font-khmer leading-tight drop-shadow-sm">{productNameKh}</h1>
          {productName && <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">{productName}</span>}
        </div>
        <div className="relative ml-auto text-center shrink-0">
          <div className="bg-white text-orange-600 rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-lg font-black leading-none">
            <span className="text-lg">{weight || '100g'}</span>
            <span className="text-[7px] tracking-wider mt-0.5">NET WT</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-4">
        {/* Nutrition pills */}
        <div className="grid grid-cols-5 gap-2">
          {stats.map((s, i) => (
            <div key={i} className={`${s.c} rounded-xl text-white text-center py-2 px-1 shadow-sm`}>
              <div className="text-lg font-black leading-none">{s.v}</div>
              <div className="text-[8px] font-semibold opacity-90">{s.u}</div>
              <div className="text-[8px] font-bold uppercase tracking-wide mt-1">{s.e}</div>
              <div className="text-[8px] font-khmer opacity-90">{s.k}</div>
            </div>
          ))}
        </div>

        {/* Ingredients chips */}
        <div className="text-left">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">គ្រឿងផ្សំ / Ingredients</h4>
          <div className="flex flex-wrap gap-1.5">
            {ingredients.length > 0 ? ingredients.map((i, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-khmer text-amber-900">
                {(i.nameKh || i.name)} <span className="text-amber-500 font-bold">{i.percentage || 10}%</span>
              </span>
            )) : <span className="text-[11px] font-khmer text-slate-500">មិនមានព័ត៌មានគ្រឿងផ្សំ</span>}
          </div>
        </div>

        {allergens.length > 0 && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-[10px] text-rose-900 font-khmer">
            <strong className="uppercase tracking-wide text-rose-600">អាឡែហ្ស៊ី / Allergens: </strong>{allergens.join(', ')}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between gap-4 border-t border-slate-100 pt-3 mt-1">
          <div className="flex flex-col gap-1">
            <svg className="barcode-svg max-h-[38px] max-w-[170px]"></svg>
            {warnings.length > 0 && <span className="text-[9px] font-bold font-khmer text-rose-600">{warnings.join('. ')}</span>}
          </div>
          <div className="text-right text-[9px] text-slate-500">
            <span className="block"><strong className="text-slate-700">Exp / ផុតកំណត់:</strong> {expiry || '6 Months'}</span>
            <span className="block font-bold uppercase tracking-wider text-amber-600 mt-0.5">🇰🇭 Product of Cambodia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
