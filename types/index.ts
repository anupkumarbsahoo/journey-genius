export interface Coordinates {
  lat: number;
  lon: number;
}

export interface AttractionType {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  isHiddenGem?: boolean;
  tags: string[];
  osmId?: string;
  description?: string;
  website?: string;
  phone?: string;
  openingHours?: string;
  imageUrl?: string;
  distance?: number;
}

export interface RouteType {
  distance: number;
  duration: number;
  geometry: GeoJSON.LineString;
  waypoints: RouteWaypoint[];
  legs: RouteLeg[];
}

export interface RouteWaypoint {
  name: string;
  coordinates: [number, number];
}

export interface RouteLeg {
  distance: number;
  duration: number;
  summary: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  meals: {
    breakfast: MealSuggestion;
    lunch: MealSuggestion;
    dinner: MealSuggestion;
  };
  hotel: HotelSuggestion;
  activities: Activity[];
  dailyBudget: number;
  transportTips: string;
}

export interface MealSuggestion {
  name: string;
  cuisine: string;
  priceRange: string;
  description: string;
}

export interface HotelSuggestion {
  name: string;
  stars: number;
  pricePerNight: number;
  description: string;
  amenities: string[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  duration: string;
  cost: number;
  category: string;
  tips: string;
}

export interface ItineraryData {
  destination: string;
  totalDays: number;
  estimatedBudget: number;
  bestTimeToVisit: string;
  weatherNote: string;
  travelTips: string[];
  days: ItineraryDay[];
}

export interface TripType {
  id: string;
  title: string;
  description?: string;
  fromLocation: string;
  toLocation: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  status: "PLANNING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  isShared: boolean;
  shareToken?: string;
  thumbnailUrl?: string;
  createdAt: string;
  waypoints?: WaypointType[];
}

export interface WaypointType {
  id: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  order: number;
  type: string;
  notes?: string;
}

export interface ExpenseType {
  id: string;
  category: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface FilterState {
  categories: string[];
  radiusMiles: number;
  showHiddenGems: boolean;
  minRating: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type Category =
  | "tourism"
  | "restaurant"
  | "gas_station"
  | "grocery"
  | "hospital"
  | "ev_charging"
  | "hotel"
  | "park"
  | "shopping";

export const CATEGORY_LABELS: Record<Category, string> = {
  tourism: "Attractions",
  restaurant: "Restaurants",
  gas_station: "Gas Stations",
  grocery: "Grocery & Stores",
  hospital: "Hospitals",
  ev_charging: "EV Charging",
  hotel: "Hotels",
  park: "Parks",
  shopping: "Shopping",
};

export const CATEGORY_ICONS: Record<string, string> = {
  tourism: "🏛️",
  restaurant: "🍽️",
  gas_station: "⛽",
  grocery: "🛒",
  hospital: "🏥",
  ev_charging: "⚡",
  hotel: "🏨",
  park: "🌳",
  shopping: "🛍️",
  other: "📍",
};
