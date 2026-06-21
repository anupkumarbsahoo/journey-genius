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

═══ DAY 1 MUST be a DRIVE DAY — NOT a destination sightseeing day ═══
- "dayType": "drive_there"
- "theme": "Drive: ${params.origin} → ${params.destination}"
- activities: Exactly ${Math.min(params.attractionsPerDay, 4)} stops ALONG THE HIGHWAY CORRIDOR between the two cities. Every activity "name" MUST start with "🚗 En Route: " (e.g. "🚗 En Route: Delaware Water Gap Scenic Overlook"). Pick real, well-known en-route stops: rest areas, scenic overlooks, roadside diners, small towns, state parks, historic landmarks that travellers actually pass through on this route. The LAST activity must be "🏁 Arrive & Check In at ${params.destination}" (time: "Evening", cost: 0).
- meals: Breakfast, lunch, and dinner should all be at real restaurants/diners/cafes ALONG THE DRIVING ROUTE between the two cities — NOT at ${params.destination} yet. Append "(En Route)" to each meal name.
- hotel: The first night's hotel IN ${params.destination} (checked in upon arrival).
- transportTips: "Approx. X-hour drive (~Y miles). Take [major highway names]. Fill up at [mid-route city]. Leave early to enjoy stops."
${params.days >= 3 ? `
═══ DAYS 2 through ${params.days - 1} — DESTINATION DAYS ═══
- "dayType": "destination" for each of these days
- Focus entirely on attractions in and around ${params.destination} within ${params.radiusMiles} miles
- Normal dining and hotel accommodations in ${params.destination}` : ''}
${params.days > 1 ? `
═══ DAY ${params.days} MUST be a RETURN DRIVE DAY — NOT a destination sightseeing day ═══
- "dayType": "drive_back"
- "theme": "Return Drive: ${params.destination} → ${params.origin}"
- activities: Exactly ${Math.min(params.attractionsPerDay, 4)} stops on the return journey. FIRST activity: "🏁 Check Out & Depart ${params.destination}" (time: "Morning", cost: 0). Middle stops prefixed with "🔄 Return: " (e.g., "🔄 Return: Roadside Diner Lunch Stop"). LAST activity: "🏠 Arrive Home at ${params.origin}" (time: "Evening", cost: 0).
- meals: Breakfast, lunch, and dinner at diners/restaurants ALONG THE RETURN ROUTE — NOT in ${params.destination}. Append "(Return Route)" to each meal name.
- hotel: {"name": "Home", "stars": 0, "pricePerNight": 0, "description": "No hotel needed — returning home today.", "amenities": []}
- transportTips: "Return drive ~X hours. [Highway route back]. Consider [alternative scenic route] on the way back."` : ''}
` : isCarTrip ? `Travel Mode: DRIVING to ${params.destination} — include driving tips in transportTips fields.` : `Travel Mode: FLIGHT to ${params.destination}`}

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
      "dayType": "drive_there | destination | drive_back",
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
