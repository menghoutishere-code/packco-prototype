// Vercel Serverless Function: AI SVG Logo Generator
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userPrompt, brandName, estYear, primaryColor, secondaryColor } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables.' });
  }

  const systemInstruction = `
    You are an expert graphic designer and SVG developer.
    Your task is to design a high-quality, professional, and visually stunning brand logo/emblem for a retail food product.
    
    You will output ONLY valid, well-formed, and clean SVG code.
    
    Requirements:
    1. SVG dimensions: viewBox="0 0 120 120".
    2. Style: Artistic, modern, and high-end. Include a primary illustration representing the motif/subject requested by the user.
    3. Custom brand texts:
       - Incorporate the brand name: "${brandName || 'Agri Khmer'}" inside the logo (e.g. aligned along a curved path or centered below the graphic).
       - Incorporate the establishing year: "${estYear || '2026'}" (e.g., "EST. 2026" or "SINCE 2026").
    4. Color Palette:
       - Use the primary color "${primaryColor || '#f59e0b'}" for key accents, illustration lines, or brand texts.
       - Use the secondary color "${secondaryColor || '#1e293b'}" for the background frame, borders, or secondary text.
    5. Clean vector paths: All elements must be pure SVG elements (<path>, <circle>, <polygon>, <text>, <defs>, <linearGradient>, etc.).
    6. Typography: Use clean Google Fonts like 'Outfit', 'Inter', or standard web-safe sans-serif fonts in your text elements.
    7. Responsive and scale-free: Do not hardcode absolute width/height in px inside the style, let viewBox handle it.
    
    Return ONLY raw SVG code. Do NOT enclose in markdown code blocks like \`\`\`xml or \`\`\`svg. Start directly with "<svg" and end with "</svg>".
  `;

  try {
    const prompt = `Design a logo with the motif: "${userPrompt || 'mango fruit illustration'}". Brand: "${brandName || 'Agri Khmer'}", Est: "${estYear || '2026'}", Primary: "${primaryColor || '#f59e0b'}", Secondary: "${secondaryColor || '#1e293b'}".`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
    console.error("Logo generation error:", error);
    return res.status(500).json({ error: 'Failed to generate SVG logo.' });
  }
}
