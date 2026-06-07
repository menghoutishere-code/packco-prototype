/**
 * Programmatically draws the compliance label templates onto a high-res 2D Canvas.
 * This canvas serves as the source texture for perspective wrapping.
 * 
 * @param {HTMLCanvasElement} canvas - The target canvas to render onto.
 * @param {object} labelData - The AI-generated or manually adjusted compliance data.
 * @param {string} productName - The raw English product name.
 * @param {string} weight - Net weight.
 * @param {string} expiry - Expiry period.
 * @param {string} barcodeText - Barcode content.
 * @param {string} templateType - 'pouch', 'kraft', or 'panel'.
 * @param {string|null} logoImgUrl - Image URL of the selected asset logo (if any).
 */
export async function drawLabel2D(canvas, labelData, productName, weight, expiry, barcodeText, templateType, customLogoSvg, customLogoUrl) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // Resolve logo source (vector SVG converted to base64 DataURL, or image URL)
  let logoImgUrl = customLogoUrl;
  if (!logoImgUrl && customLogoSvg) {
    try {
      logoImgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(customLogoSvg)));
    } catch (e) {
      console.error('Failed to convert SVG to data URL', e);
    }
  }

  // Set colors and font families
  const primaryKhmerFont = "'Noto Sans Khmer', 'Kantumruy Pro', sans-serif";
  const primarySansFont = "'Inter', 'Outfit', sans-serif";

  const nutrition = labelData.nutritionFacts || {};
  const ingredients = labelData.ingredients || [];
  const allergens = labelData.allergensKh || [];
  const warnings = labelData.mandatoryWarningsKh || [];
  const productNameKh = labelData.productNameKh || 'ឈ្មោះផលិតផល';

  if (templateType === 'kraft') {
    // --- 1. PREMIUM KRAFT STYLE ---
    // Background color
    ctx.fillStyle = '#fdfaf4';
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#c4b9ad';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Decorative inner thin border
    ctx.strokeStyle = '#dcd4c9';
    ctx.lineWidth = 1;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    // Brand Header
    ctx.fillStyle = '#786c62';
    ctx.font = `800 12px ${primarySansFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('ARTISANAL HERITAGE', w / 2, 45);

    // Brand Logo Asset (if available)
    let nextY = 80;
    if (logoImgUrl) {
      const img = await loadImage(logoImgUrl);
      const aspect = img.width / img.height;
      const lw = 90;
      const lh = lw / aspect;
      ctx.save();
      // Draw image circle cropped or with mix-blend-multiply
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(img, w / 2 - lw / 2, nextY, lw, lh);
      ctx.restore();
      nextY += lh + 15;
    }

    // Product Title Khmer
    ctx.fillStyle = '#3d2e24';
    ctx.font = `bold 26px ${primaryKhmerFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(productNameKh, w / 2, nextY);
    nextY += 28;

    // English subtitle
    if (productName) {
      ctx.fillStyle = '#706459';
      ctx.font = `500 13px ${primarySansFont}`;
      ctx.fillText(`— ${productName.toUpperCase()} —`, w / 2, nextY);
      nextY += 25;
    }

    // Origin Badge
    ctx.fillStyle = '#8c7b70';
    ctx.font = `italic 11px ${primarySansFont}`;
    ctx.fillText('Handcrafted in Cambodia · ផលិតផលប្រណីតកម្ពុជា', w / 2, nextY);
    nextY += 30;

    // Ingredients
    ctx.fillStyle = '#5e5148';
    ctx.font = `800 11px ${primarySansFont}`;
    ctx.fillText('គ្រឿងផ្សំ / INGREDIENTS', w / 2, nextY);
    nextY += 16;

    ctx.fillStyle = '#4d423a';
    ctx.font = `500 11px ${primaryKhmerFont}`;
    const ingText = ingredients.length > 0
      ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
      : 'មិនមានព័ត៌មានគ្រឿងផ្សំ';
    wrapText(ctx, ingText, w / 2, nextY, w - 60, 18);
    nextY += 45;

    // Mini Horizontal Nutrition Fact Table
    ctx.strokeStyle = '#e6dccf';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, nextY);
    ctx.lineTo(w - 30, nextY);
    ctx.stroke();
    nextY += 15;

    ctx.fillStyle = '#5e5148';
    ctx.font = `800 11px ${primarySansFont}`;
    ctx.fillText('តម្លៃអាហារូបត្ថម្ភ / NUTRITION (100G)', w / 2, nextY);
    nextY += 15;

    // Grid columns
    const cols = [
      { l: 'CAL', v: `${nutrition.calories || 0}` },
      { l: 'FAT', v: `${nutrition.fat || 0}g` },
      { l: 'CARB', v: `${nutrition.carbs || 0}g` },
      { l: 'PROT', v: `${nutrition.protein || 0}g` },
      { l: 'SOD', v: `${nutrition.sodium || 0}mg` }
    ];
    const colW = (w - 60) / 5;
    cols.forEach((col, idx) => {
      const cx = 30 + idx * colW + colW / 2;
      ctx.fillStyle = '#8c7b70';
      ctx.font = `800 9px ${primarySansFont}`;
      ctx.fillText(col.l, cx, nextY);
      
      ctx.fillStyle = '#3d2e24';
      ctx.font = `bold 12px ${primarySansFont}`;
      ctx.fillText(col.v, cx, nextY + 16);

      if (idx < 4) {
        ctx.strokeStyle = '#ebdcb9';
        ctx.beginPath();
        ctx.moveTo(30 + (idx + 1) * colW, nextY - 5);
        ctx.lineTo(30 + (idx + 1) * colW, nextY + 22);
        ctx.stroke();
      }
    });
    nextY += 35;

    ctx.strokeStyle = '#e6dccf';
    ctx.beginPath();
    ctx.moveTo(30, nextY);
    ctx.lineTo(w - 30, nextY);
    ctx.stroke();
    nextY += 22;

    // Dates Info grid
    ctx.fillStyle = '#9c8e82';
    ctx.font = `800 8px ${primarySansFont}`;
    ctx.fillText('NET WEIGHT', w / 3 - 15, nextY);
    ctx.fillText('EXPIRY PERIOD', (w / 3) * 2 + 15, nextY);

    ctx.fillStyle = '#3d2e24';
    ctx.font = `bold 12px ${primarySansFont}`;
    ctx.fillText(weight || '100g', w / 3 - 15, nextY + 16);
    ctx.fillText(expiry || '6 Months', (w / 3) * 2 + 15, nextY + 16);
    nextY += 38;

    // Warnings
    if (warnings.length > 0) {
      ctx.fillStyle = '#b91c1c';
      ctx.font = `bold 10px ${primaryKhmerFont}`;
      ctx.fillText(`* ${warnings.join('. ')}`, w / 2, nextY);
      nextY += 22;
    }

    // Barcode
    drawCanvasBarcode(ctx, barcodeText, w / 2, nextY, 130, 40);

  } else if (templateType === 'panel') {
    // --- 2. BACK COMPLIANCE PANEL ---
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = '#cbd5e1'; // slate-300
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Header banner slate-800
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(15, 15, w - 30, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 18px ${primaryKhmerFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(productNameKh, w / 2, 40);

    if (productName) {
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = `bold 11px ${primarySansFont}`;
      ctx.fillText(`${productName.toUpperCase()} · COMPLIANCE LABEL`, w / 2, 60);
    }

    let nextY = 95;

    // Logo image if active
    if (logoImgUrl) {
      const img = await loadImage(logoImgUrl);
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(img, w / 2 - 35, nextY, 70, 70);
      ctx.restore();
      nextY += 82;
    }

    // Nutrition facts table border
    ctx.fillStyle = '#f1f5f9'; // slate-100
    ctx.fillRect(25, nextY, w - 50, 150);

    ctx.strokeStyle = '#0f172a'; // slate-900
    ctx.lineWidth = 1.5;
    ctx.strokeRect(25, nextY, w - 50, 150);

    // Table Header
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.fillRect(25, nextY, w - 50, 25);
    ctx.strokeRect(25, nextY, w - 50, 25);
    
    ctx.fillStyle = '#0f172a';
    ctx.font = `800 10px ${primarySansFont}`;
    ctx.fillText('ព័ត៌មានអាហារូបត្ថម្ភ / NUTRITION FACTS', w / 2, nextY + 16);
    nextY += 25;

    // Serving size
    ctx.font = `600 9px ${primarySansFont}`;
    ctx.fillText(`ទំហំនៃការបម្រើ / Serving Size: ${weight || '100g'}`, w / 2, nextY + 15);
    nextY += 22;

    ctx.beginPath();
    ctx.moveTo(25, nextY);
    ctx.lineTo(w - 25, nextY);
    ctx.stroke();

    // Nutrients rows
    const rowVals = [
      { k: 'ថាមពល / Calories', v: `${nutrition.calories || 0} kcal`, b: true },
      { k: 'ជាតិខ្លាញ់ / Fat', v: `${nutrition.fat || 0}g` },
      { k: 'កាបូអ៊ីដ្រាត / Carbs', v: `${nutrition.carbs || 0}g` },
      { k: 'ប្រូតេអ៊ីន / Protein', v: `${nutrition.protein || 0}g` },
      { k: 'សូដ្យូម / Sodium', v: `${nutrition.sodium || 0}mg` }
    ];

    rowVals.forEach((row, i) => {
      ctx.fillStyle = '#0f172a';
      ctx.font = row.b ? `bold 10px ${primarySansFont}` : `500 9.5px ${primarySansFont}`;
      
      ctx.textAlign = 'left';
      ctx.fillText(row.k, 35, nextY + 14);

      ctx.textAlign = 'right';
      ctx.fillText(row.v, w - 35, nextY + 14);

      nextY += 20;
      if (i < 4) {
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(25, nextY);
        ctx.lineTo(w - 25, nextY);
        ctx.stroke();
      }
    });
    nextY += 15;

    // Ingredients
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = `800 9px ${primarySansFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('គ្រឿងផ្សំ / INGREDIENTS:', 25, nextY);
    nextY += 14;

    ctx.fillStyle = '#1e293b';
    ctx.font = `500 11px ${primaryKhmerFont}`;
    const ingText = ingredients.length > 0
      ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
      : 'មិនមានគ្រឿងផ្សំ';
    wrapText(ctx, ingText, 25, nextY, w - 50, 16, false);
    nextY += 38;

    // Producer / Expiry Card
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(25, nextY, w - 50, 42);

    ctx.fillStyle = '#94a3b8';
    ctx.font = `800 7.5px ${primarySansFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('ផលិតដោយ / PRODUCER', 32, nextY + 12);
    ctx.fillText('ផុតកំណត់ / EXPIRY', w / 2 + 10, nextY + 12);

    ctx.fillStyle = '#1e293b';
    ctx.font = `bold 10.5px ${primaryKhmerFont}`;
    ctx.fillText('សហគ្រាសសាកល្បង', 32, nextY + 28);
    ctx.font = `bold 11px ${primarySansFont}`;
    ctx.fillText(expiry || '6 Months', w / 2 + 10, nextY + 28);
    nextY += 58;

    // Allergen warnings
    if (allergens.length > 0) {
      ctx.fillStyle = '#fef2f2'; // red-50
      ctx.fillRect(25, nextY, w - 50, 30);
      ctx.strokeStyle = '#fee2e2'; // red-100
      ctx.strokeRect(25, nextY, w - 50, 30);
      
      ctx.fillStyle = '#991b1b'; // red-800
      ctx.font = `bold 9.5px ${primaryKhmerFont}`;
      ctx.fillText(`អាឡែហ្ស៊ី / Allergens: ${allergens.join(', ')}`, 30, nextY + 18);
      nextY += 40;
    }

    // Warnings
    if (warnings.length > 0) {
      ctx.fillStyle = '#dc2626'; // red-600
      ctx.font = `bold 10px ${primaryKhmerFont}`;
      ctx.textAlign = 'center';
      ctx.fillText(warnings.join('. '), w / 2, nextY);
      nextY += 22;
    }

    // Icons & Barcode Row
    ctx.fillStyle = '#94a3b8';
    ctx.font = `14px ${primarySansFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('♻️ 🚯 🍽️', 30, nextY + 25);

    drawCanvasBarcode(ctx, barcodeText, w - 100, nextY, 90, 35, false);

  } else {
    // --- 3. POPULAR DUPLEX POUCH LABEL (DEFAULT) ---
    // Background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Borders
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(16, 16, w - 32, h - 32);

    // Accent Orange/Amber top band
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.5, '#ea580c');
    grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad;
    ctx.fillRect(18, 18, w - 36, 15);

    // Header Content
    ctx.fillStyle = '#64748b';
    ctx.font = `800 10px ${primarySansFont}`;
    ctx.textAlign = 'center';
    ctx.fillText('PACKCO COMPLIANCE', w / 2, 52);

    let nextY = 75;

    // Logo image if active
    if (logoImgUrl) {
      const img = await loadImage(logoImgUrl);
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(img, w / 2 - 35, nextY, 70, 70);
      ctx.restore();
      nextY += 80;
    }

    // Product Title Khmer
    ctx.fillStyle = '#0f172a';
    ctx.font = `bold 24px ${primaryKhmerFont}`;
    ctx.fillText(productNameKh, w / 2, nextY);
    nextY += 26;

    // Subtitle English
    if (productName) {
      ctx.fillStyle = '#475569';
      ctx.font = `italic 12px ${primarySansFont}`;
      ctx.fillText(productName, w / 2, nextY);
      nextY += 20;
    }

    // Origin Badge
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(30, nextY, w - 60, 22);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, nextY, w - 60, 22);
    
    ctx.fillStyle = '#334155';
    ctx.font = `bold 9.5px ${primaryKhmerFont}`;
    ctx.fillText('ផលិតផលខ្មែរ / Product of Cambodia', w / 2, nextY + 14);
    nextY += 38;

    // Bilingual Nutrition Panel
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, nextY, w - 60, 155);

    // Box Header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(30, nextY, w - 60, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold 10px ${primaryKhmerFont}`;
    ctx.fillText('ព័ត៌មានអាហារូបត្ថម្ភ / Nutrition Facts', w / 2, nextY + 16);
    nextY += 24;

    // Serving Size
    ctx.fillStyle = '#0f172a';
    ctx.font = `bold 9px ${primarySansFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('ទំហំនៃការបម្រើ / Serving Size:', 38, nextY + 15);
    ctx.textAlign = 'right';
    ctx.fillText(weight || '100g', w - 38, nextY + 15);
    nextY += 22;

    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, nextY);
    ctx.lineTo(w - 30, nextY);
    ctx.stroke();

    // Table Headings
    ctx.fillStyle = '#64748b';
    ctx.font = `800 8px ${primarySansFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('សារធាតុចិញ្ចឹម / NUTRIENTS', 38, nextY + 11);
    ctx.textAlign = 'right';
    ctx.fillText('បរិមាណ / AMOUNT', w - 38, nextY + 11);
    nextY += 16;

    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(30, nextY);
    ctx.lineTo(w - 30, nextY);
    ctx.stroke();

    // Nutrients values
    const pouchRows = [
      { k: 'ថាមពល / Calories', v: `${nutrition.calories || 0} kcal`, b: true },
      { k: 'ជាតិខ្លាញ់សរុប / Total Fat', v: `${nutrition.fat || 0}g` },
      { k: 'កាបូអ៊ីដ្រាត / Carbs', v: `${nutrition.carbs || 0}g` },
      { k: 'ប្រូតេអ៊ីន / Protein', v: `${nutrition.protein || 0}g` },
      { k: 'សូដ្យូម / Sodium', v: `${nutrition.sodium || 0}mg` }
    ];

    pouchRows.forEach((r, idx) => {
      ctx.fillStyle = '#0f172a';
      ctx.font = r.b ? `bold 11px ${primarySansFont}` : `500 10.5px ${primarySansFont}`;
      
      ctx.textAlign = 'left';
      ctx.fillText(r.k, 38, nextY + 15);
      
      ctx.textAlign = 'right';
      ctx.fillText(r.v, w - 38, nextY + 15);

      nextY += 18;
      if (idx < 4) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(30, nextY);
        ctx.lineTo(w - 30, nextY);
        ctx.stroke();
      }
    });
    nextY += 15;

    // Ingredients
    ctx.fillStyle = '#334155';
    ctx.font = `800 10px ${primarySansFont}`;
    ctx.textAlign = 'left';
    ctx.fillText('គ្រឿងផ្សំ / INGREDIENTS', 30, nextY);
    nextY += 14;

    ctx.fillStyle = '#334155';
    ctx.font = `500 11px ${primaryKhmerFont}`;
    const ingText = ingredients.length > 0
      ? ingredients.map(i => `${i.nameKh || i.name} (${i.percentage || 10}%)`).join(', ')
      : 'មិនមានព័ត៌មានគ្រឿងផ្សំ';
    wrapText(ctx, ingText, 30, nextY, w - 60, 16, false);
    nextY += 35;

    // Dates
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, nextY);
    ctx.lineTo(w - 30, nextY);
    ctx.stroke();
    nextY += 12;

    ctx.fillStyle = '#94a3b8';
    ctx.font = `800 8px ${primarySansFont}`;
    ctx.fillText('MFG DATE / ថ្ងៃផលិត', 30, nextY);
    ctx.fillText('EXP DATE / កាលបរិច្ឆេទផុតកំណត់', w / 2 + 10, nextY);

    ctx.fillStyle = '#0f172a';
    ctx.font = `bold 11px ${primarySansFont}`;
    ctx.fillText('07/06/2026', 30, nextY + 15);
    ctx.fillText(expiry || '6 Months', w / 2 + 10, nextY + 15);
    nextY += 30;

    // Allergen warnings
    if (allergens.length > 0) {
      ctx.fillStyle = '#fffbeb'; // amber-50
      ctx.fillRect(30, nextY, w - 60, 28);
      ctx.strokeStyle = '#fef3c7'; // amber-100
      ctx.strokeRect(30, nextY, w - 60, 28);
      
      ctx.fillStyle = '#78350f'; // amber-900
      ctx.font = `bold 9.5px ${primaryKhmerFont}`;
      ctx.fillText(`ព័ត៌មានអាឡែហ្ស៊ី: ${allergens.join(', ')}`, 35, nextY + 18);
      nextY += 38;
    }

    // Warnings
    if (warnings.length > 0) {
      ctx.fillStyle = '#dc2626';
      ctx.font = `bold 10px ${primaryKhmerFont}`;
      ctx.textAlign = 'center';
      ctx.fillText(warnings.join('. '), w / 2, nextY);
      nextY += 20;
    }

    // Barcode
    drawCanvasBarcode(ctx, barcodeText, w / 2, nextY, 130, 42);
  }
}

// Helper to wrap text inside canvas
function wrapText(ctx, text, x, y, maxWidth, lineHeight, isCentered = true) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, isCentered ? x : x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, isCentered ? x : x, currentY);
}

// Helper to draw a scan-ready FPO barcode directly on Canvas
function drawCanvasBarcode(ctx, code, x, y, width, height, isCentered = true) {
  ctx.save();
  const startX = isCentered ? x - width / 2 : x;
  const startY = y;

  // Draw white background plate
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(startX - 10, startY - 2, width + 20, height + 15);

  // Generate a mock pseudo-random but clean EAN-13 pattern based on barcode text
  const cleanedCode = code.replace(/[^0-9]/g, '') || '8841234567890';
  ctx.fillStyle = '#000000';
  
  // Barcode bounds
  let currentX = startX;
  const barCount = 65;
  const barWidth = width / barCount;

  // Render bars
  for (let i = 0; i < barCount; i++) {
    // Generate thick/thin patterns using characters of the barcode text
    const charIndex = Math.floor((i / barCount) * cleanedCode.length);
    const val = parseInt(cleanedCode.charAt(charIndex)) || 5;
    
    // Draw guard bars (first, middle, last) longer
    const isGuard = i < 3 || (i > 30 && i < 34) || i > 61;
    const barH = isGuard ? height : height - 8;
    const isDraw = (i % 2 === 0 && val % 2 === 0) || (i % 3 === 0 && val > 4) || isGuard;

    if (isDraw && i !== 31 && i !== 32) {
      // Draw bar
      ctx.fillRect(currentX, startY, barWidth * (val % 2 === 0 ? 1.5 : 1), barH);
    }
    currentX += barWidth;
  }

  // Draw text code underneath
  ctx.fillStyle = '#000000';
  ctx.font = "800 8.5px 'Courier New', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(code, startX + width / 2, startY + height + 8);
  
  ctx.restore();
}

// Helper to load image asynchronously in canvas
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}
