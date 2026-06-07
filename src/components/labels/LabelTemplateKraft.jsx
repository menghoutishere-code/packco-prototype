import React from 'react';

export default function LabelTemplateKraft({ labelData, productName, weight, expiry }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];

  return (
    <div className="w-full max-w-[320px] bg-[#fdfaf4] text-[#2c2724] p-6 border border-[#c4b9ad] rounded shadow-2xl flex flex-col gap-5 font-sans select-none relative overflow-hidden label-print-container">
      {/* Decorative inner line */}
      <div className="absolute inset-2 border border-[#dcd4c9] pointer-events-none"></div>

      {/* Brand Header */}
      <div className="text-center pb-2 border-b border-[#ebdcb9] relative z-10">
        <div className="text-[9px] tracking-[0.25em] text-[#786c62] uppercase font-bold">ARTISANAL HERITAGE</div>
        <h1 className="text-2xl font-normal font-khmer text-[#3d2e24] mt-2 leading-tight">
          {labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល'}
        </h1>
        {productName && (
          <p className="text-[11px] font-medium text-[#706459] uppercase tracking-[0.15em] font-sans mt-1">
            — {productName} —
          </p>
        )}
      </div>

      {/* Origin description */}
      <div className="text-center text-[9px] text-[#8c7b70] italic tracking-wide">
        Handcrafted in Cambodia &middot; ផលិតផលប្រណីតកម្ពុជា
      </div>

      {/* Structured Info Grid */}
      <div className="flex flex-col gap-3 relative z-10">
        {/* Ingredients */}
        <div className="text-center px-2">
          <h4 className="font-extrabold text-[9px] text-[#5e5148] uppercase tracking-[0.15em] mb-1">
            គ្រឿងផ្សំ / Ingredients
          </h4>
          <p className="text-[10px] font-khmer text-[#4d423a] leading-relaxed">
            {ingredients.length > 0
              ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
              : 'មិនមានព័ត៌មានគ្រឿងផ្សំ'}
          </p>
        </div>

        {/* Horizontal Mini Nutrition Table */}
        <div className="border-t border-b border-[#e6dccf] py-2">
          <h4 className="font-extrabold text-[9px] text-center text-[#5e5148] uppercase tracking-[0.15em] mb-2">
            តម្លៃអាហារូបត្ថម្ភ / Nutrition (100g)
          </h4>
          <div className="grid grid-cols-5 gap-1 text-center">
            <div className="border-r border-[#ebdcb9] last:border-0 px-1">
              <span className="block text-[8px] text-[#8c7b70] uppercase">Cal</span>
              <span className="text-[10px] font-bold text-[#3d2e24]">{nutrition.calories || 0}</span>
            </div>
            <div className="border-r border-[#ebdcb9] last:border-0 px-1">
              <span className="block text-[8px] text-[#8c7b70] uppercase">Fat</span>
              <span className="text-[10px] font-bold text-[#3d2e24]">{nutrition.fat || 0}g</span>
            </div>
            <div className="border-r border-[#ebdcb9] last:border-0 px-1">
              <span className="block text-[8px] text-[#8c7b70] uppercase">Carb</span>
              <span className="text-[10px] font-bold text-[#3d2e24]">{nutrition.carbs || 0}g</span>
            </div>
            <div className="border-r border-[#ebdcb9] last:border-0 px-1">
              <span className="block text-[8px] text-[#8c7b70] uppercase">Prot</span>
              <span className="text-[10px] font-bold text-[#3d2e24]">{nutrition.protein || 0}g</span>
            </div>
            <div className="px-1">
              <span className="block text-[8px] text-[#8c7b70] uppercase">Sod</span>
              <span className="text-[10px] font-bold text-[#3d2e24]">{nutrition.sodium || 0}mg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dates, weight and expiry details */}
      <div className="grid grid-cols-3 gap-2 border-b border-[#ebdcb9] pb-3 text-center text-[9px] text-[#706459] relative z-10">
        <div>
          <span className="block text-[7px] uppercase tracking-wider text-[#9c8e82]">Net Weight</span>
          <span className="text-[#3d2e24] font-semibold">{weight || '100g'}</span>
        </div>
        <div>
          <span className="block text-[7px] uppercase tracking-wider text-[#9c8e82]">Expiry</span>
          <span className="text-[#3d2e24] font-semibold">{expiry || '6 Months'}</span>
        </div>
        <div>
          <span className="block text-[7px] uppercase tracking-wider text-[#9c8e82]">Source</span>
          <span className="text-[#3d2e24] font-semibold">Natural</span>
        </div>
      </div>

      {/* Warnings & Storage */}
      {warnings.length > 0 && (
        <div className="text-center text-[9px] font-khmer text-red-700/80 leading-normal italic relative z-10 px-2">
          * {warnings.join('. ')}
        </div>
      )}

      {/* Barcode Section */}
      <div className="flex justify-center mt-1 relative z-10">
        <svg className="barcode-svg max-h-[45px] max-w-full opacity-85 mix-blend-multiply"></svg>
      </div>
    </div>
  );
}
