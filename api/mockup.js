import { MOCKUPS } from './_mockups.js';

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';

// Per-format geometry instructions. The blank package shape differs per mockup, so a
// single generic "wrap onto the front" prompt mislabels multi-panel / angled / cylindrical
// packs (e.g. it only labelled one of two pouches). Each entry tells Nano Banana exactly
// which surface(s) to print on and how the artwork should foreshorten.
const GEOMETRY = {
  'pouch-lifestyle':
    'Apply the artwork to the flat front face of the single stand-up pouch, filling the panel above the clear product window. Follow the gentle bowing and soft wrinkles of the pouch surface.',
  'pouch-isometric':
    'The pouch is shown at a three-quarter (isometric) angle. Apply the artwork onto the angled FRONT face only, with correct perspective so it recedes naturally toward the back; do NOT paint the side gusset with the front artwork.',
  'pouch-front-back':
    'There are TWO pouches. The LEFT pouch is the FRONT — apply the full front-of-pack artwork to it. The RIGHT pouch is the BACK of the SAME product — give it a matching brand-coloured back panel: a small repeat of the logo at top and a clean light area where nutrition/ingredients would print. Keep both pouches consistent in brand colour and lighting.',
  'jar-front':
    'Wrap the artwork around the cylindrical glass jar as a single front label centred on the jar body below the lid. The label must curve with the cylinder so its left and right edges foreshorten and the centre faces the camera.',
  'jar-lifestyle':
    'Wrap the artwork around the cylindrical glass jar as a front label centred on the body, curving with the jar so the edges foreshorten realistically.',
  'box-isometric':
    'The carton box is shown at an angle. Apply the artwork FLAT onto the front face only, matching the box perspective and edges exactly. Do not let the artwork bleed onto the top or side faces.',
  'box-lifestyle':
    'Apply the artwork FLAT onto the front face of the carton box, matching its perspective and squared edges. Front face only.',
  'tube-front':
    'Wrap the artwork around the cylindrical canister/tube as a front-facing wraparound label. It must curve with the cylinder, foreshortening at the left and right edges.',
  'tub-front':
    'Apply the artwork onto the curved front wall of the tub, following its outward taper and curvature so it conforms to the rounded body.',
};

const DEFAULT_GEOMETRY =
  'Apply the artwork onto the main front-facing surface of the package, following its shape and curvature.';

function buildPrompt(mockupId, userPrompt) {
  const geometry = GEOMETRY[mockupId] || DEFAULT_GEOMETRY;
  let p = `You are an elite product-packaging photographer and retoucher.
Image 1 is a photograph of a blank, unlabeled package on a surface with real-world lighting.
Image 2 is the finished FRONT-OF-PACK brand artwork (logo, product name, net weight) for this product.

${geometry}

Print the artwork as if it were physically applied to the package: match the existing lighting, highlights, shadows, perspective, and the material texture (kraft paper grain, glass reflections, carton matte, etc.) so it looks manufactured, not pasted. Trim away the artwork's flat background so only the design sits on the package. Keep every element from the artwork sharp, undistorted, and legible. Do NOT change the background, the surface, the props, the camera angle, or the number of packages. Output a single photorealistic retail product photograph.`;
  if (userPrompt) p += `\nAdditional art direction: ${userPrompt}`;
  return p;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') body = {};

  // designPng = the clean front-of-pack artwork (raw base64, no data: prefix).
  // labelPng kept as a backwards-compatible alias.
  const { mockupId, designPng, labelPng, userPrompt } = body;
  const artwork = designPng || labelPng;

  if (!artwork) {
    return res.status(400).json({ error: 'Missing designPng' });
  }

  const blank = MOCKUPS[mockupId] || MOCKUPS['pouch-lifestyle'];
  const prompt = buildPrompt(mockupId, userPrompt);

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: blank },
              { inlineData: { mimeType: 'image/png', data: artwork } }
            ]
          }
        ],
        generationConfig: { responseModalities: ['IMAGE'] }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Gemini API responded with error',
        details: errorText.slice(0, 400)
      });
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(p => p.inlineData || p.inline_data);

    if (!imgPart) {
      const finishReason = data?.candidates?.[0]?.finishReason;
      return res.status(502).json({ error: 'No image returned', finishReason });
    }

    const b64 = (imgPart.inlineData || imgPart.inline_data).data;
    return res.status(200).json({ image: 'data:image/png;base64,' + b64 });
  } catch (error) {
    console.error('Mockup composition error:', error);
    return res.status(500).json({ error: 'Failed to compose product mockup.' });
  }
}
