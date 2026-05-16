import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateItineraryWithGroq(params: {
  destination: string;
  days: number;
  budget: number;
  interests: string[];
  travelStyle: string;
}): Promise<string> {
  const prompt = `You are WanderPilot AI, an expert travel planner. Create a detailed ${params.days}-day itinerary for ${params.destination}.

Budget: $${params.budget} total
Interests: ${params.interests.join(", ")}
Travel Style: ${params.travelStyle}

Generate a comprehensive JSON itinerary with this exact structure:
{
  "destination": "string",
  "totalDays": number,
  "estimatedBudget": number,
  "bestTimeToVisit": "string",
  "weatherNote": "string",
  "travelTips": ["string"],
  "days": [
    {
      "day": number,
      "date": "Day 1",
      "theme": "string",
      "meals": {
        "breakfast": {"name": "string", "cuisine": "string", "priceRange": "string", "description": "string"},
        "lunch": {"name": "string", "cuisine": "string", "priceRange": "string", "description": "string"},
        "dinner": {"name": "string", "cuisine": "string", "priceRange": "string", "description": "string"}
      },
      "hotel": {"name": "string", "stars": number, "pricePerNight": number, "description": "string", "amenities": ["string"]},
      "activities": [
        {
          "time": "string",
          "name": "string",
          "description": "string",
          "duration": "string",
          "cost": number,
          "category": "string",
          "tips": "string"
        }
      ],
      "dailyBudget": number,
      "transportTips": "string"
    }
  ]
}

Make it realistic, exciting, and budget-appropriate. Return ONLY valid JSON.`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 4000,
  });

  return completion.choices[0]?.message?.content || "";
}

export async function getAIRecommendations(params: {
  location: string;
  interests: string[];
  question: string;
}): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are WanderPilot AI, a friendly and knowledgeable travel assistant. You help travelers discover hidden gems, plan perfect trips, and get local insights. Location context: ${params.location}. User interests: ${params.interests.join(", ")}.`,
      },
      { role: "user", content: params.question },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
}

export async function getHiddenGems(location: string, category: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `List 5 hidden gem ${category} spots near ${location} that most tourists miss. For each, provide: name, why it's special, best time to visit, and insider tips. Format as JSON array with fields: name, description, bestTime, insiderTip, category.`,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.9,
    max_tokens: 1500,
  });

  return completion.choices[0]?.message?.content || "[]";
}
