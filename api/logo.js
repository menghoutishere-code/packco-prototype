// Vercel Serverless Function: AI Raster Logo Generator (Gemini image model)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt, brandName, estYear, primaryColor, secondaryColor } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables.' });
  }

  const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';

  const motif = userPrompt || 'mango fruit illustration';
  const brand = brandName || 'Agri Khmer';
  const year = estYear || '2026';
  const primary = primaryColor || '#f59e0b';
  const secondary = secondaryColor || '#1e293b';

  const prompt = `
    Design a premium, high-end retail food-brand emblem/logo.
    Motif/subject: "${motif}". Render it as a clean, stylized illustration that anchors the emblem.
    Brand name text: "${brand}" — integrate it legibly into the logo (curved banner, centered below, or framing arc).
    Include the founding-year text exactly as "EST. ${year}".
    Color palette: use primary color ${primary} for the main illustration and accents, and secondary color ${secondary} for the frame, borders, and secondary text.

    STRICT COMPOSITING REQUIREMENTS (this logo will be composited onto product labels using multiply blending, so the background MUST read as transparent):
    - The logo must be FLAT vector-style artwork, NOT a photograph and NOT a 3D render.
    - Center the logo on a PURE WHITE (#FFFFFF) background that fills the entire image.
    - Absolutely NO photographic scene, NO background texture, NO gradients in the background, NO drop shadow, NO glow, NO mockup, NO product packaging around it.
    - Square framing (1:1), with the emblem centered and comfortable margins.
    - Crisp, clean edges and bold, legible typography.
    Output only the finished logo emblem on a pure white background.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE'] }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Gemini API responded with error', details: errorText });
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imgPart = parts.find(p => p.inlineData || p.inline_data);
    const finishReason = data?.candidates?.[0]?.finishReason;

    if (!imgPart) {
      return res.status(502).json({ error: 'No image returned', finishReason });
    }

    const b64 = (imgPart.inlineData || imgPart.inline_data).data;

    return res.status(200).json({ image: 'data:image/png;base64,' + b64 });
  } catch (error) {
    console.error("Logo generation error:", error);
    return res.status(500).json({ error: 'Failed to generate logo.' });
  }
}
