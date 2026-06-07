import fs from 'fs';
import path from 'path';

const MOCKUP_FILES = {
  'pouch-front-back': 'pouch-front-back-blank.jpg',
  'pouch-isometric': 'pouch-isometric-blank.jpg',
  'pouch-lifestyle': 'pouch-lifestyle-blank.jpg',
  'jar-front': 'jar-front-blank.jpg',
  'jar-lifestyle': 'jar-lifestyle-blank.jpg',
  'box-isometric': 'box-isometric-blank.jpg',
  'box-lifestyle': 'box-lifestyle-blank.jpg',
  'tube-front': 'tube-front-blank.jpg',
  'tub-front': 'tub-front-blank.jpg'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mockupId, labelData, customLogoSvg, userPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables.' });
  }

  // Resolve mockup image path
  const filename = MOCKUP_FILES[mockupId] || 'pouch-lifestyle-blank.jpg';
  let imagePath = path.join(process.cwd(), 'public', 'mockup', filename);
  
  if (!fs.existsSync(imagePath)) {
    imagePath = path.join(process.cwd(), 'prototype-app', 'public', 'mockup', filename);
  }
  if (!fs.existsSync(imagePath)) {
    imagePath = path.join('c:', 'Users', 'Admin', 'Desktop', 'Unipreneur', 'prototype-app', 'public', 'mockup', filename);
  }

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: `Mockup image file not found on server at path: ${imagePath}` });
  }

  try {
    const fileBuffer = fs.readFileSync(imagePath);
    const base64Image = fileBuffer.toString('base64');

    const systemInstruction = `
      You are an expert AI packaging mockup compositor.
      You will be given a photograph of a blank food packaging container (stand-up pouch, jar, box, canister, or tub).
      
      Your goal is to output a single, complete, valid SVG (dimensions 1408x768) that overlays a beautifully designed, premium retail label onto the packaging container in the photo.
      
      SVG Requirements:
      1. Background Mockup: Must contain:
         <image href="/mockup/${filename}" x="0" y="0" width="1408" height="768" />
         This draws the realistic photo as the background.
      2. Label Design Group: Inside a <g> element, draw the product label. It must look premium, modern, and aligned to the container's surface.
      3. Perspective Warping: You MUST apply perspective warping, rotation, scaling, or coordinates transforms on the label group using:
         <g transform="matrix(a, b, c, d, e, f)">
         (or rotate/skew/translate) so that the label aligns exactly with the package shape and curve in the photo.
      4. Label Content elements:
         - Brand name & Product title (English & Khmer).
         - Include the custom SVG logo:
           ${customLogoSvg || '<circle cx="50" cy="50" r="10" fill="#f59e0b" />'}
           (You must position and scale the custom SVG logo inside the label layout).
         - Ingredients list in Khmer.
         - A structured, styled Nutrition Facts table.
         - Expiry and net weight.
         - GS1 Barcode (drawn using line bars or simple rects).
      5. Aesthetic: Match the color schemes and clean 3-column layout (Left: ingredients/compliance, Center: Brand name/logo/product name, Right: nutrition table/manufacturer info). Use transparent panels or matching solid fills to blend the label seamlessly.
      6. User Instruction Refinement: Take into account the user's specific request: "${userPrompt || 'wrap the label naturally onto the container'}" when positioning, coloring, or styling the overlay.
      
      Return ONLY raw SVG code. Do NOT enclose in markdown code blocks. Start directly with "<svg" and end with "</svg>".
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image
                }
              },
              {
                text: `Please compose the package label on this mockup image. Details: Product: ${labelData.productNameKh || 'Dried Mango'}, Ingredients: ${JSON.stringify(labelData.ingredients)}, Nutrition: ${JSON.stringify(labelData.nutritionFacts)}. User preference: ${userPrompt || 'make it blend naturally'}.`
              }
            ]
          }
        ],
        systemInstruction: { parts: [{ text: systemInstruction }] }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Gemini API responded with error', details: errorText });
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // Clean up code blocks if the model ignored instructions and wrapped it in markdown
    if (rawText.includes('```')) {
      const match = rawText.match(/<svg[\s\S]*?<\/svg>/i);
      if (match) {
        rawText = match[0];
      }
    }

    return res.status(200).json({ svg: rawText });
  } catch (error) {
    console.error("Mockup composition error:", error);
    return res.status(500).json({ error: 'Failed to compose 3D mockup.' });
  }
}
