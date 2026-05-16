import { NextRequest, NextResponse } from "next/server";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

async function geocode(location: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${MAPBOX_TOKEN}&limit=1`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (data.features?.[0]) {
      const [lng, lat] = data.features[0].center;
      return [lng, lat];
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const scenic = searchParams.get("scenic") === "true";

  if (!from || !to) {
    return NextResponse.json({ error: "from and to are required" }, { status: 400 });
  }

  if (!MAPBOX_TOKEN) {
    return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 });
  }

  try {
    const [fromCoords, toCoords] = await Promise.all([
      geocode(from),
      geocode(to),
    ]);

    if (!fromCoords || !toCoords) {
      return NextResponse.json({ error: "Could not geocode one or both locations" }, { status: 400 });
    }

    const profile = scenic ? "mapbox/cycling" : "mapbox/driving-traffic";
    const url = `https://api.mapbox.com/directions/v5/${profile}/${fromCoords[0]},${fromCoords[1]};${toCoords[0]},${toCoords[1]}?access_token=${MAPBOX_TOKEN}&geometries=geojson&overview=full&steps=true&annotations=distance,duration`;

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Mapbox API error: ${res.status}`);

    const data = await res.json();
    if (!data.routes?.[0]) {
      return NextResponse.json({ error: "No route found" }, { status: 404 });
    }

    const mapboxRoute = data.routes[0];
    const route = {
      distance: mapboxRoute.distance,
      duration: mapboxRoute.duration,
      geometry: mapboxRoute.geometry,
      waypoints: [
        { name: from, coordinates: fromCoords },
        { name: to, coordinates: toCoords },
      ],
      legs: mapboxRoute.legs.map((leg: { distance: number; duration: number; summary?: string }) => ({
        distance: leg.distance,
        duration: leg.duration,
        summary: leg.summary || "",
      })),
    };

    return NextResponse.json({ route }, {
      headers: { "Cache-Control": "public, s-maxage=300" },
    });
  } catch (error) {
    console.error("Route API error:", error);
    return NextResponse.json({ error: "Failed to calculate route" }, { status: 500 });
  }
}
