import { MOCKUPS } from './_mockups.js';

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image';

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
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  if (!body || typeof body !== 'object') {
    body = {};
  }

  const { mockupId, labelPng, userPrompt } = body;

  if (!labelPng) {
    return res.status(400).json({ error: 'Missing labelPng' });
  }

  const blank = MOCKUPS[mockupId] || MOCKUPS['pouch-lifestyle'];

  let prompt = `You are an expert product photographer and retoucher.
Image 1 is a photograph of a blank, unlabeled product package on a surface with real-world lighting.
Image 2 is the finished label/artwork design for that product.
Print and wrap the label from image 2 naturally onto the front panel of the package in image 1.
Follow the package's curvature and contours, and if the package has a clear window, respect it so the label conforms realistically.
Match the existing lighting, highlights, shadows, perspective, and material texture of the package so the label looks physically printed on it.
Keep all text and details from the label sharp, undistorted, and legible.
Do not change the background, the surface, the props, or the camera angle.
Output a single photorealistic retail product photograph.`;

  if (userPrompt) {
    prompt += `\nAdditional art direction: ${userPrompt}`;
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inlineData: blank },
              { inlineData: { mimeType: 'image/png', data: labelPng } }
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
