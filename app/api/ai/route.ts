import { NextRequest, NextResponse } from "next/server";
import { getAIRecommendations } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { message, history, location, interests } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    // Build a contextual question with history
    let fullQuestion = message;
    if (history && history.length > 0) {
      const historyContext = history
        .map((m: { role: string; content: string }) => `${m.role}: ${m.content}`)
        .join("\n");
      fullQuestion = `Previous conversation:\n${historyContext}\n\nUser: ${message}`;
    }

    const response = await getAIRecommendations({
      location: location || "worldwide",
      interests: interests || ["travel", "exploration"],
      question: fullQuestion,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "AI assistant is currently unavailable" },
      { status: 500 }
    );
  }
}
