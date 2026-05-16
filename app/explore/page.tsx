import { Metadata } from "next";
import { ExplorePage } from "@/components/pages/ExplorePage";

export const metadata: Metadata = {
  title: "Explore Attractions",
  description: "Discover attractions, restaurants, and hidden gems near any location.",
};

export default function Explore() {
  return <ExplorePage />;
}
