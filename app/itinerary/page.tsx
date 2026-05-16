import { Metadata } from "next";
import { ItineraryPage } from "@/components/pages/ItineraryPage";

export const metadata: Metadata = {
  title: "AI Itinerary Generator",
  description: "Generate personalized day-by-day travel itineraries with AI.",
};

export default function Itinerary() {
  return <ItineraryPage />;
}
