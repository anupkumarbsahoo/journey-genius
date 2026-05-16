import { NextRequest, NextResponse } from "next/server";
import { getCurrentWeather } from "@/lib/weather";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  if (!lat || !lon) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const weather = await getCurrentWeather(lat, lon);
  if (!weather) {
    return NextResponse.json({ error: "Weather data unavailable" }, { status: 503 });
  }

  return NextResponse.json(weather, {
    headers: { "Cache-Control": "public, s-maxage=1800" },
  });
}
