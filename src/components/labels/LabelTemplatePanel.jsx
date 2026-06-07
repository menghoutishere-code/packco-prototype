import React from 'react';

export default function LabelTemplatePanel({ labelData, productName, weight, expiry, customLogoSvg, customLogoUrl }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];

  return (
    <div className="w-full max-w-[320px] bg-slate-50 text-slate-900 p-5 border border-slate-300 rounded shadow-2xl flex flex-col gap-4 font-sans select-none label-print-container">
      {/* Title Panel Banner */}
      <div className="bg-slate-800 text-white p-2 text-center rounded">
        {/* Brand Logo Element (custom or default) */}
        {(customLogoSvg || customLogoUrl) && (
          <div className="flex justify-center items-center my-1.5 max-h-[50px] overflow-hidden">
            {customLogoSvg ? (
              <div className="w-11 h-11 flex items-center justify-center bg-white p-1 rounded" dangerouslySetInnerHTML={{ __html: customLogoSvg }} />
            ) : (
              <img src={customLogoUrl} alt="Brand Logo" className="w-11 h-11 object-contain bg-white p-1 rounded" />
            )}
          </div>
        )}

        <h1 className="text-base font-bold font-khmer leading-snug">
          {labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល'}
        </h1>
        {productName && (
          <p className="text-[10px] text-slate-300 font-sans tracking-wide">
            {productName} &middot; Compliance Label
          </p>
        )}
      </div>

      {/* Bilingual Nutrition Table with clean dark border */}
      <div className="border border-slate-900 bg-white">
        <div className="bg-slate-200 p-1.5 text-center font-extrabold text-xs border-b border-slate-900 uppercase tracking-wide">
          ព័ត៌មានអាហារូបត្ថម្ភ / NUTRITION FACTS
        </div>
        <div className="flex justify-between text-[9px] border-b border-slate-900 px-2 py-1 font-semibold">
          <span>ទំហំនៃការបម្រើ / Serving Size:</span>
          <span>{weight || '100g'}</span>
        </div>

        <div className="flex flex-col text-[10px]">
          <div className="flex justify-between border-b border-slate-200 px-2 py-0.5 font-bold">
            <span className="font-khmer text-[9px]">ថាមពល / Calories</span>
            <span>{nutrition.calories || 0} kcal</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 px-2 py-0.5">
            <span className="font-khmer text-[9px]">ជាតិខ្លាញ់ / Fat</span>
            <span>{nutrition.fat || 0}g</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 px-2 py-0.5">
            <span className="font-khmer text-[9px]">កាបូអ៊ីដ្រាត / Carbs</span>
            <span>{nutrition.carbs || 0}g</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 px-2 py-0.5">
            <span className="font-khmer text-[9px]">ប្រូតេអ៊ីន / Protein</span>
            <span>{nutrition.protein || 0}g</span>
          </div>
          <div className="flex justify-between px-2 py-0.5">
            <span className="font-khmer text-[9px]">សូដ្យូម / Sodium</span>
            <span>{nutrition.sodium || 0}mg</span>
          </div>
        </div>
      </div>

      {/* Ingredients List with nice clean border */}
      <div className="bg-white border border-slate-200 p-2 rounded text-left">
        <span className="block font-extrabold text-[9px] text-slate-500 uppercase tracking-wider mb-1">
          គ្រឿងផ្សំ / Ingredients:
        </span>
        <p className="text-[10px] font-khmer text-slate-800 leading-relaxed">
          {ingredients.length > 0
            ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
            : 'មិនមានគ្រឿងផ្សំ'}
        </p>
      </div>

      {/* Regulatory Info */}
      <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-600 bg-white border border-slate-200 p-2 rounded">
        <div>
          <span className="block font-bold text-[8px] uppercase tracking-wider text-slate-400">ផលិតដោយ / Producer</span>
          <span className="text-slate-800 font-khmer">សហគ្រាសសាកល្បង</span>
        </div>
        <div>
          <span className="block font-bold text-[8px] uppercase tracking-wider text-slate-400">ផុតកំណត់ / Expiry</span>
          <span className="text-slate-800">{expiry || '6 Months'}</span>
        </div>
      </div>

      {/* Allergen Warning Box */}
      {allergens.length > 0 && (
        <div className="border border-red-200 bg-red-50 p-2 rounded text-[9px] text-red-900 font-khmer leading-snug">
          <strong>អាឡែហ្ស៊ី / Allergens: </strong>
          {allergens.join(', ')}
        </div>
      )}

      {/* Warnings & Storage */}
      {warnings.length > 0 && (
        <div className="text-[9px] font-bold font-khmer text-red-600 text-center leading-normal">
          {warnings.join('. ')}
        </div>
      )}

      {/* QR Placeholder + Barcode side-by-side */}
      <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-4">
        {/* Decorative compliance icons (recycling, keep clean, etc.) */}
        <div className="flex gap-1.5 shrink-0 opacity-60">
          <span title="Recycle" className="text-xs">♻️</span>
          <span title="Keep Clean" className="text-xs">🚯</span>
          <span title="Food Safe" className="text-xs">🍽️</span>
        </div>
        <svg className="barcode-svg max-h-[40px] max-w-full grow"></svg>
      </div>
    </div>
  );
}
