import { NextRequest, NextResponse } from "next/server";

// Free geocoding via Nominatim (OpenStreetMap) — no API key needed
async function geocode(location: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      {
        headers: { "User-Agent": "WanderPilot-AI/1.0 (travel planning app)" },
        next: { revalidate: 3600 },
      }
    );
    const data = await res.json();
    if (data[0]) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
    return null;
  } catch {
    return null;
  }
}

// Free routing via OSRM (OpenStreetMap Routing Machine) — no API key needed
async function getOSRMRoute(
  from: [number, number],
  to: [number, number]
): Promise<{
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  legs: { distance: number; duration: number; summary: string }[];
} | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson&steps=true`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== "Ok" || !data.routes?.[0]) return null;

    const r = data.routes[0];
    return {
      distance: r.distance,
      duration: r.duration,
      geometry: r.geometry,
      legs: r.legs.map((leg: { distance: number; duration: number; summary?: string }) => ({
        distance: leg.distance,
        duration: leg.duration,
        summary: leg.summary || "",
      })),
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!from || !to) {
    return NextResponse.json({ error: "from and to are required" }, { status: 400 });
  }

  try {
    const [fromCoords, toCoords] = await Promise.all([
      geocode(from),
      geocode(to),
    ]);

    if (!fromCoords || !toCoords) {
      return NextResponse.json(
        { error: "Could not find one or both locations. Try a more specific name." },
        { status: 400 }
      );
    }

    const osrmRoute = await getOSRMRoute(fromCoords, toCoords);
    if (!osrmRoute) {
      return NextResponse.json({ error: "No route found between these locations" }, { status: 404 });
    }

    const route = {
      ...osrmRoute,
      waypoints: [
        { name: from, coordinates: fromCoords },
        { name: to, coordinates: toCoords },
      ],
    };

    return NextResponse.json({ route }, {
      headers: { "Cache-Control": "public, s-maxage=300" },
    });
  } catch (error) {
    console.error("Route API error:", error);
    return NextResponse.json({ error: "Failed to calculate route" }, { status: 500 });
  }
}
