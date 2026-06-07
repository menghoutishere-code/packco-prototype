import React from 'react';

export default function LabelTemplateKraft({ labelData, productName, weight, expiry, customLogoSvg, customLogoUrl }) {
  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];

  return (
    <div className="w-full max-w-[800px] bg-[#fcf9f2] text-[#3d2e24] p-6 border-2 border-[#d6cbbe] rounded-lg shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-6 font-serif select-none relative overflow-hidden label-print-container min-h-[400px]">
      {/* Decorative inner kraft line border */}
      <div className="absolute inset-2.5 border border-[#e8dfd3] pointer-events-none rounded"></div>

      {/* Repeating fine grid background pattern for organic texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, #3d2e24 1px, transparent 1px)',
        backgroundSize: '16px 16px'
      }}></div>

      {/* LEFT COLUMN: Compliance & Warnings */}
      <div className="flex flex-col justify-between gap-4 border-r border-[#ebdcb9] pr-4 md:border-b-0 border-b pb-4 md:pb-0 relative z-10">
        <div className="flex flex-col gap-3">
          <div className="text-[8px] font-bold tracking-[0.2em] text-[#8c7b70] uppercase font-sans">TRADITIONAL HERITAGE</div>
          
          <div className="flex flex-col gap-1 text-left">
            <h4 className="font-bold text-[9px] text-[#5e5148] uppercase tracking-wider font-sans">
              គ្រឿងផ្សំ / Ingredients
            </h4>
            <p className="text-[10px] font-khmer text-[#4d423a] leading-relaxed">
              {ingredients.length > 0
                ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
                : 'មិនមានព័ត៌មានគ្រឿងផ្សំ'}
            </p>
          </div>

          {/* Allergen Warning Box */}
          {allergens.length > 0 && (
            <div className="border border-[#c4b9ad] bg-[#f5efe4] p-2 rounded text-[9px] text-[#5c4a3c] font-khmer leading-snug font-sans">
              <strong className="text-[#8c7b70] uppercase tracking-wider block mb-0.5">ព័ត៌មានអាឡែហ្ស៊ី / Allergen Alert</strong>
              {allergens.join(', ')}
            </div>
          )}
        </div>

        {/* Barcode & Volume */}
        <div className="flex flex-col items-center gap-2 border-t border-[#ebdcb9] pt-3">
          <svg className="barcode-svg max-h-[42px] max-w-full opacity-80 mix-blend-multiply"></svg>
          <div className="text-[9px] font-bold text-[#706459] uppercase tracking-wider font-sans">
            Net Weight / ទម្ងន់សុទ្ធ: {weight || '100g'}
          </div>
        </div>
      </div>

      {/* CENTER COLUMN: Logo & Brand details */}
      <div className="flex flex-col justify-between items-center text-center py-2 relative z-10 md:border-b-0 border-b pb-4 md:pb-0">
        <div className="w-full flex flex-col items-center gap-1">
          <div className="text-[9px] tracking-[0.25em] text-[#786c62] uppercase font-bold font-sans">ARTISANAL SPECIFIC</div>
          <div className="w-8 h-[1px] bg-[#c4b9ad] my-1"></div>
        </div>

        {/* Dynamic Graphic/Illustration */}
        <div className="flex justify-center items-center my-4 min-h-[100px] w-full max-h-[110px] overflow-hidden">
          {customLogoSvg ? (
            <div className="w-24 h-24 flex items-center justify-center svg-logo-container mix-blend-multiply" dangerouslySetInnerHTML={{ __html: customLogoSvg }} />
          ) : customLogoUrl ? (
            <img src={customLogoUrl} alt="Brand Logo" className="w-24 h-24 object-contain mix-blend-multiply" />
          ) : (
            <div className="w-20 h-20 rounded-full border border-dashed border-[#c4b9ad] flex items-center justify-center text-[10px] text-[#8c7b70] font-sans">
              No Logo
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-1.5 mt-2">
          <h1 className="text-2xl font-normal font-khmer text-[#3d2e24] leading-tight">
            {labelData.productNameKh || labelData.productNameKhmer || 'ឈ្មោះផលិតផល'}
          </h1>
          {productName && (
            <p className="text-[11px] font-medium text-[#706459] uppercase tracking-[0.15em] font-sans mt-0.5">
              — {productName} —
            </p>
          )}
          <span className="text-[8px] text-[#8c7b70] tracking-[0.2em] font-bold font-sans uppercase mt-1">
            Cambodian Original Quality
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN: Nutrition & Date details */}
      <div className="flex flex-col justify-between gap-4 border-l border-[#ebdcb9] pl-4 relative z-10">
        {/* Minimalist Nutrition Table */}
        <div className="border border-[#c4b9ad] p-2 rounded bg-white/50">
          <div className="text-center font-bold text-[10px] border-b border-[#c4b9ad] pb-1 uppercase tracking-wider font-sans text-[#5e5148]">
            Nutrition Facts / តម្លៃអាហារូបត្ថម្ភ
          </div>
          <div className="flex justify-between text-[8px] border-b border-[#e6dccf] py-1 font-sans font-medium">
            <span>Serving Size / ទំហំនៃការបម្រើ:</span>
            <span>{weight || '100g'}</span>
          </div>

          <div className="flex flex-col text-[10px] gap-0.5 mt-1 font-sans text-[#4d423a]">
            <div className="flex justify-between font-bold border-b border-[#e6dccf] pb-0.5">
              <span>Calories</span>
              <span>{nutrition.calories || 0} kcal</span>
            </div>
            <div className="flex justify-between border-b border-[#e6dccf] pb-0.5">
              <span>Fat</span>
              <span>{nutrition.fat || 0}g</span>
            </div>
            <div className="flex justify-between border-b border-[#e6dccf] pb-0.5">
              <span>Carbs</span>
              <span>{nutrition.carbs || 0}g</span>
            </div>
            <div className="flex justify-between border-b border-[#e6dccf] pb-0.5">
              <span>Protein</span>
              <span>{nutrition.protein || 0}g</span>
            </div>
            <div className="flex justify-between pb-0.5">
              <span>Sodium</span>
              <span>{nutrition.sodium || 0}mg</span>
            </div>
          </div>
        </div>

        {/* Date cards & storage info */}
        <div className="flex flex-col gap-2 font-sans">
          {/* Expiry Card */}
          <div className="grid grid-cols-2 gap-2 text-[8px] text-[#8c7b70] font-semibold border-t border-[#e6dccf] pt-2">
            <div>
              <span className="block text-[7px] uppercase tracking-wider text-[#9c8e82]">Mfg Date / ថ្ងៃផលិត</span>
              <span className="text-[#3d2e24] font-mono">07/06/2026</span>
            </div>
            <div>
              <span className="block text-[7px] uppercase tracking-wider text-[#9c8e82]">Expiry / ថ្ងៃផុតកំណត់</span>
              <span className="text-[#3d2e24] font-mono">{expiry || '6 Months'}</span>
            </div>
          </div>

          {/* Warnings & Storage */}
          {warnings.length > 0 && (
            <div className="text-center text-[8px] font-bold font-khmer text-[#991b1b]/80 leading-normal border-t border-[#ebdcb9] pt-1.5">
              * {warnings.join('. ')}
            </div>
          )}

          {/* Keep Cambodian clean logo row */}
          <div className="flex justify-between items-center border-t border-[#e6dccf] pt-2 text-[9px] text-[#8c7b70] opacity-80">
            <span>♻️ 🚯 🍽️</span>
            <span className="text-[7.5px] font-bold uppercase tracking-wider">Natural Artisan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
