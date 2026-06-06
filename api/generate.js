// Vercel Serverless Function: AI Label Compliance Generator
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rawInput } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in Vercel environment variables.' });
  }

  const systemInstruction = `
    You are a Cambodian food labeling compliance officer specializing in Ministry of Commerce Sub-Decree 112 on product labeling.
    
    Translate raw food product inputs (ingredients, product name) into technically correct, legally compliant Khmer terms.
    Structure the ingredients in descending order of weight percentage.
    Calculate estimated nutrition facts (Calories, Fat, Carbs, Protein, Sodium) per 100g based on standard guidelines.
    Output the specific mandatory warning phrase: "រក្សាទុកក្នុងកន្លែងត្រជាក់និងស្ងួត" (Store in a cool, dry place) under mandatoryWarningsKh.
    Identify any potential allergens from the list (such as cashews, peanuts, soy, dairy) and add them in Khmer to allergensKh.

    Respond ONLY with a JSON object following this exact schema:
    {
      "productNameKh": "Translated Khmer Product Name",
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
    
    // Return parsed JSON directly
    return res.status(200).json(JSON.parse(resultText.trim()));
  } catch (error) {
    console.error("AI Generation error:", error);
    return res.status(500).json({ error: 'Failed to process AI compliance formatting.' });
  }
}
