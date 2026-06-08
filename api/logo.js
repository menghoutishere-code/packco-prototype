// Vercel Serverless Function: AI Raster Logo Generator (Gemini image model)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt, brandName, estYear, primaryColor, secondaryColor, logoStyle } = req.body;
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

  // Per-logo-type art direction. Each clause shapes a genuinely different logo format
  // instead of forcing every result into the same badge/seal.
  const STYLE_CLAUSES = {
    wordmark: `Create a WORDMARK logo: the brand name "${brand}" set in distinctive, custom-styled typography that IS the logo. No icon, no badge, no enclosing frame — let the lettering carry the brand personality.`,
    lettermark: `Create a LETTERMARK / monogram from the initials of "${brand}": a clean, bold, geometric monogram. Minimal; no enclosing frame unless it strengthens the mark.`,
    icon: `Create a PICTORIAL ICON logo: a single, simple, instantly recognizable symbol of "${motif}", bold and minimal, with the brand name "${brand}" set cleanly beneath in simple type. No badge frame.`,
    abstract: `Create an ABSTRACT MARK: a modern geometric or fluid abstract symbol that evokes "${motif}" without literally depicting it, paired with the brand name "${brand}" in clean type. No badge frame.`,
    mascot: `Create a MASCOT logo: a friendly, characterful illustrated mascot inspired by "${motif}" with a clear silhouette and personality, plus the brand name "${brand}" in a clean banner or beneath. Playful but premium.`,
    combination: `Create a COMBINATION MARK: a distinct icon of "${motif}" paired with the brand name "${brand}" in a balanced lockup (icon above or beside the text). Cohesive and versatile.`,
    emblem: `Design a premium retail food-brand EMBLEM / SEAL: a "${motif}" illustration anchoring the badge, the brand name "${brand}" integrated into a curved banner or framing arc, and the founding year "EST. ${year}". Use ${secondary} for the frame, borders, and secondary text.`,
  };
  const styleClause = STYLE_CLAUSES[logoStyle] || STYLE_CLAUSES.combination;

  const prompt = `
    You are an expert brand-logo designer. Design ONE professional, original logo for a Cambodian food brand.

    ${styleClause}

    Color palette: use ${primary} as the primary color and ${secondary} as the secondary/accent color — use these exact colors.

    STRICT OUTPUT REQUIREMENTS (the logo is composited onto product labels with multiply blending, so the background MUST read as pure white):
    - FLAT vector-style artwork — NOT a photograph and NOT a 3D render.
    - Centered on a PURE WHITE (#FFFFFF) background that fills the entire image.
    - NO photographic scene, NO background texture, NO background gradient, NO drop shadow, NO glow, NO mockup, NO packaging around it.
    - Square 1:1 framing with comfortable margins.
    - Crisp clean edges; bold, legible typography for any text.
    Output only the finished logo on a pure white background.
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
