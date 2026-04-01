const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const callGemini = async (prompt, systemInstruction = null) => {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  // Use recommended gemini-2.5-flash model for complex reasoning
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", response.status, errorText);
      throw new Error(`Gemini API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const textResponse = data.candidates[0].content.parts[0].text;
      try {
        // Since we enforced application/json, the response should be a JSON string
        return JSON.parse(textResponse);
      } catch (parseError) {
         console.error("Failed to parse Gemini response as JSON", textResponse);
         throw new Error("Gemini did not return valid JSON");
      }
    } else {
      throw new Error("No candidates returned from Gemini");
    }

  } catch (error) {
    console.error("Error in callGeminiApi:", error);
    throw error;
  }
};
