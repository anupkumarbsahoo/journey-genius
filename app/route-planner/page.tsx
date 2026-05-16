import { Metadata } from "next";
import { RoutePlannerPage } from "@/components/pages/RoutePlannerPage";

export const metadata: Metadata = {
  title: "Route Planner",
  description: "Plan optimized routes with scenic options and fuel cost estimates.",
};

export default function RoutePlanner() {
  return <RoutePlannerPage />;
}
