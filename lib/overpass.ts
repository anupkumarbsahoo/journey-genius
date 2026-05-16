export interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

export interface Attraction {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  isHiddenGem?: boolean;
  tags: string[];
  osmId: string;
  description?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  imageUrl?: string;
}

const OVERPASS_API = "https://overpass-api.de/api/interpreter";

const CATEGORY_QUERIES: Record<string, string> = {
  tourism: `node["tourism"~"attraction|museum|gallery|viewpoint|theme_park|zoo|aquarium|monument|artwork"]({{bbox}});
            way["tourism"~"attraction|museum|gallery|viewpoint|theme_park|zoo|aquarium|monument"]({{bbox}});`,
  restaurant: `node["amenity"="restaurant"]({{bbox}});
               node["amenity"="cafe"]({{bbox}});
               node["amenity"="bar"]({{bbox}});`,
  gas_station: `node["amenity"="fuel"]({{bbox}});`,
  grocery: `node["shop"~"supermarket|convenience|grocery"]({{bbox}});
            node["name"~"Walmart|Costco|Safeway|Kroger|Whole Foods|Target",i]({{bbox}});`,
  hospital: `node["amenity"~"hospital|clinic|pharmacy"]({{bbox}});`,
  ev_charging: `node["amenity"="charging_station"]({{bbox}});`,
  hotel: `node["tourism"="hotel"]({{bbox}});
          node["tourism"="motel"]({{bbox}});
          node["tourism"="hostel"]({{bbox}});`,
  park: `node["leisure"="park"]({{bbox}});
         way["leisure"="park"]({{bbox}});`,
  shopping: `node["shop"~"mall|department_store|marketplace"]({{bbox}});`,
};

function getBbox(lat: number, lon: number, radiusMiles: number): string {
  const radiusDeg = (radiusMiles * 1.60934) / 111.32;
  return `${lat - radiusDeg},${lon - radiusDeg},${lat + radiusDeg},${lon + radiusDeg}`;
}

function parseElement(el: OverpassElement, category: string): Attraction | null {
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  const name = el.tags.name;

  if (!lat || !lon || !name) return null;

  const tags = Object.entries(el.tags)
    .filter(([k]) => ["tourism", "amenity", "leisure", "shop", "cuisine"].includes(k))
    .map(([, v]) => v);

  return {
    id: `osm-${el.id}`,
    osmId: String(el.id),
    name,
    category,
    latitude: lat,
    longitude: lon,
    address: [el.tags["addr:street"], el.tags["addr:city"]].filter(Boolean).join(", ") || undefined,
    website: el.tags.website || el.tags["contact:website"] || undefined,
    phone: el.tags.phone || el.tags["contact:phone"] || undefined,
    openingHours: el.tags.opening_hours || undefined,
    tags,
    isHiddenGem: false,
    description: el.tags.description || undefined,
  };
}

export async function fetchAttractions(
  lat: number,
  lon: number,
  radiusMiles: number,
  categories: string[] = ["tourism"]
): Promise<Attraction[]> {
  const bbox = getBbox(lat, lon, radiusMiles);

  const queryParts = categories
    .map((cat) => CATEGORY_QUERIES[cat] || "")
    .filter(Boolean)
    .map((q) => q.replace(/\{\{bbox\}\}/g, bbox));

  const query = `[out:json][timeout:25];
(
  ${queryParts.join("\n")}
);
out body center;`;

  try {
    const response = await fetch(OVERPASS_API, {
      method: "POST",
      body: query,
      headers: { "Content-Type": "text/plain" },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);

    const data = await response.json();
    const attractions: Attraction[] = [];

    for (const el of data.elements || []) {
      const category = detectCategory(el.tags);
      const attraction = parseElement(el, category);
      if (attraction) attractions.push(attraction);
    }

    return attractions.slice(0, 100);
  } catch (error) {
    console.error("Overpass API error:", error);
    return [];
  }
}

function detectCategory(tags: Record<string, string>): string {
  if (tags.amenity === "restaurant" || tags.amenity === "cafe" || tags.amenity === "bar") return "restaurant";
  if (tags.amenity === "fuel") return "gas_station";
  if (tags.amenity === "charging_station") return "ev_charging";
  if (tags.amenity === "hospital" || tags.amenity === "clinic") return "hospital";
  if (tags.shop === "supermarket" || tags.shop === "convenience") return "grocery";
  if (tags.tourism === "hotel" || tags.tourism === "motel") return "hotel";
  if (tags.leisure === "park") return "park";
  if (tags.tourism) return "tourism";
  return "other";
}

export async function searchNominatim(query: string): Promise<{
  lat: number;
  lon: number;
  displayName: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "User-Agent": "WanderPilot-AI/1.0" } }
    );
    const data = await response.json();
    if (data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
    }
    return null;
  } catch {
    return null;
  }
}
