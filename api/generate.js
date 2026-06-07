// Vercel Serverless Function: AI Label Compliance Generator
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Safely parse the request body — on Vercel req.body can be undefined or a string.
  let body = {};
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body;
  }

  const { rawInput, inputLanguage } = body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables.' });
  }

  if (!rawInput) {
    return res.status(400).json({ error: 'Missing rawInput' });
  }

  const systemInstruction = `
    You are a Cambodian food labeling compliance officer specializing in Ministry of Commerce Sub-Decree 112 on product labeling and Prakas No. 0059 on nutrition labeling.
    
    The user's input language is: "${inputLanguage || 'en'}".
    
    If the input language is "en" (English):
    - Translate raw food product inputs (ingredients, product name) into technically correct, legally compliant Khmer terms.
    
    If the input language is "km" (Khmer):
    - Keep the product name and ingredients in Khmer, but correct any spelling errors or awkward phrasing to ensure professional compliance.
    
    For both input languages:
    - Structure the ingredients in descending order of weight percentage.
    - Calculate estimated nutrition facts (Calories, Fat, Carbs, Protein, Sodium) per 100g based on standard guidelines.
    - Output the specific mandatory warning phrase: "រក្សាទុកក្នុងកន្លែងត្រជាក់និងស្ងួត" (Store in a cool, dry place) under mandatoryWarningsKh.
    - Identify any potential allergens from the list (such as cashews, peanuts, soy, dairy, crustaceans) and add them in Khmer to allergensKh.
    
    Respond ONLY with a JSON object following this exact schema:
    {
      "productNameKh": "Translated or refined Khmer Product Name",
      "ingredients": [
        { "nameKh": "Ingredient name in Khmer", "percentage": 85 }
      ],
      "nutritionFacts": {
        "servingSize": "100g",
        "calories": 340,
        "fat": 1.2,
        "carbs": 82.0,
        "protein": 1.5,
        "sodium": 180
      },
      "allergensKh": ["Allergen 1 in Khmer"],
      "mandatoryWarningsKh": ["រក្សាទុកក្នុងកន្លែងត្រជាក់និងស្ងួត"]
    }
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Generate a label JSON for: ${rawInput}` }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Gemini API responded with error', details: errorText });
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;

    // The model may wrap output in markdown fences or surround it with prose.
    // Strip ```json / ``` fences, then fall back to extracting the first {...} block.
    let cleaned = resultText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch (e2) {
          parsed = null;
        }
      }
    }

    if (!parsed) {
      return res.status(502).json({ error: 'Model returned non-JSON', details: resultText.slice(0, 300) });
    }

    // Return parsed JSON directly
    return res.status(200).json(parsed);
  } catch (error) {
    console.error("AI Generation error:", error);
    return res.status(500).json({ error: 'Failed to process AI compliance formatting.' });
  }
}
