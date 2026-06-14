import { NextRequest, NextResponse } from "next/server";
import { generateItineraryWithGroq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, days, budget, interests, travelStyle, attractionsPerDay, radiusMiles, origin, travelMode } = body;

    if (!destination || !days || !budget) {
      return NextResponse.json(
        { error: "destination, days, and budget are required" },
        { status: 400 }
      );
    }

    if (days < 1 || days > 30) {
      return NextResponse.json({ error: "Days must be between 1 and 30" }, { status: 400 });
    }

    const rawText = await generateItineraryWithGroq({
      destination,
      days: Math.min(days, 14),
      budget,
      interests: interests || ["Culture", "Food"],
      travelStyle: travelStyle || "standard",
      attractionsPerDay: attractionsPerDay ?? 4,
      radiusMiles: radiusMiles ?? 20,
      origin,
      travelMode,
    });

    // Parse the JSON response
    let itinerary;
    try {
      const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
      itinerary = JSON.parse(cleaned);
    } catch {
      // Fallback: try to extract JSON from the response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          itinerary = JSON.parse(jsonMatch[0]);
        } catch {
          return NextResponse.json(
            { error: "Failed to parse AI response" },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json(
          { error: "AI returned invalid response" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error("Itinerary API error:", error);
    return NextResponse.json(
      { error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
