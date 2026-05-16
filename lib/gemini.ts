import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeDestinationWithGemini(destination: string): Promise<{
  overview: string;
  highlights: string[];
  bestSeason: string;
  localCuisine: string[];
  culturalTips: string[];
  safetyInfo: string;
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Analyze ${destination} as a travel destination and return a JSON object with:
  {
    "overview": "2-3 sentence overview",
    "highlights": ["top 5 must-see attractions"],
    "bestSeason": "best time to visit with reason",
    "localCuisine": ["5 local dishes to try"],
    "culturalTips": ["5 cultural etiquette tips"],
    "safetyInfo": "general safety information for travelers"
  }
  Return ONLY valid JSON.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const cleaned = text.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      overview: `${destination} is a fascinating destination with rich culture and experiences.`,
      highlights: ["Local landmarks", "Cultural sites", "Natural wonders", "Food markets", "Local festivals"],
      bestSeason: "Spring and Fall offer the best weather",
      localCuisine: ["Local specialties", "Street food", "Traditional dishes"],
      culturalTips: ["Respect local customs", "Dress appropriately", "Learn basic phrases"],
      safetyInfo: "Always stay aware of your surroundings and keep valuables secure.",
    };
  }
}

export async function generateWeatherAwarePlan(params: {
  destination: string;
  month: string;
  days: number;
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Create weather-aware travel tips for ${params.destination} in ${params.month} for a ${params.days}-day trip.
  Include: packing list, weather expectations, indoor/outdoor activity balance, and weather contingency plans.
  Format as JSON: { "weatherForecast": "string", "packingList": ["items"], "indoorActivities": ["activities"], "outdoorActivities": ["activities"], "contingencyPlans": ["plans"] }
  Return ONLY valid JSON.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function getPersonalizedRecommendations(params: {
  userProfile: { interests: string[]; travelStyle: string; budget: string };
  destination: string;
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `Based on this traveler profile:
  - Interests: ${params.userProfile.interests.join(", ")}
  - Travel Style: ${params.userProfile.travelStyle}
  - Budget: ${params.userProfile.budget}

  Generate 5 personalized attraction recommendations for ${params.destination}.
  Return JSON array: [{"name": "string", "reason": "string", "matchScore": number, "category": "string", "estimatedTime": "string"}]
  Return ONLY valid JSON array.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
