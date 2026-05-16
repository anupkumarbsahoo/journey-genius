import { Metadata } from "next";
import { SavedTripsPage } from "@/components/pages/SavedTripsPage";

export const metadata: Metadata = {
  title: "Saved Trips",
  description: "View and manage your saved travel plans.",
};

export default function SavedTrips() {
  return <SavedTripsPage />;
}
