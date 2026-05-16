import { NextRequest, NextResponse } from "next/server";
import { fetchAttractions } from "@/lib/overpass";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const radius = parseFloat(searchParams.get("radius") || "5");
  const categoriesParam = searchParams.get("categories") || "tourism";

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  if (radius > 100) {
    return NextResponse.json({ error: "Radius too large (max 100 miles)" }, { status: 400 });
  }

  const categories = categoriesParam.split(",").filter(Boolean);

  try {
    const attractions = await fetchAttractions(lat, lon, radius, categories);

    return NextResponse.json(
      { attractions, count: attractions.length },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Attractions API error:", error);
    return NextResponse.json({ error: "Failed to fetch attractions" }, { status: 500 });
  }
}
