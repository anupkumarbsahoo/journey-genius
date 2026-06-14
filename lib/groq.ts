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
  attractionsPerDay: number;
  radiusMiles: number;
  origin?: string;
  travelMode?: 'car' | 'flight';
}): Promise<string> {
  const radiusContext =
    params.radiusMiles <= 10
      ? "city centre only — walkable attractions within the downtown core"
      : params.radiusMiles <= 30
      ? "city and suburbs — include nearby neighbourhoods and suburban highlights"
      : params.radiusMiles <= 60
      ? "regional area — include attractions up to a short drive away in surrounding towns"
      : "wide region — venture well beyond the city; prioritise the most popular and highly-rated attractions across the entire area even if they require day trips";

  const isCarTrip = params.travelMode === 'car';
  const hasOrigin = isCarTrip && params.origin;

  const prompt = `You are WanderPilot AI, an expert travel planner. Create a detailed ${params.days}-day itinerary for ${params.destination}.

Budget: $${params.budget} total
Interests: ${params.interests.join(", ")}
Travel Style: ${params.travelStyle}
Activities per day: exactly ${params.attractionsPerDay} activities (${params.attractionsPerDay <= 2 ? "light pace, relaxed" : params.attractionsPerDay <= 4 ? "standard pace" : "packed schedule, maximum sightseeing"})
Attraction radius: ${params.radiusMiles} miles — ${radiusContext}. When radius is larger, replace less-popular nearby attractions with higher-rated ones from farther away.
${hasOrigin ? `
Travel Mode: DRIVING — Road Trip from "${params.origin}" to "${params.destination}"
DAY 1 IS A TRAVEL/DRIVE DAY: Include ${Math.min(params.attractionsPerDay, 4)} interesting en-route stops along the driving route from ${params.origin} to ${params.destination}. Prefix each stop activity "name" with "🚗 En Route: " (e.g., "🚗 En Route: Scenic Overlook"). Choose diverse stops: scenic viewpoints, small towns, state parks, roadside diners, historic landmarks, and roadside attractions along the highway corridor. The last activity of Day 1 should be named "Arrive & Check In at ${params.destination}" with cost 0.
Days 2 and beyond: Focus entirely on attractions in and around ${params.destination} within the specified radius.` : isCarTrip ? `Travel Mode: DRIVING to ${params.destination} — include driving tips in transportTips fields.` : `Travel Mode: FLIGHT to ${params.destination}`}

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
