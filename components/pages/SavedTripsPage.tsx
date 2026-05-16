"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Plus, Search, MapPin, Plane } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TripCard } from "@/components/cards/TripCard";
import toast from "react-hot-toast";
import type { TripType } from "@/types";

const DEMO_TRIPS: TripType[] = [
  {
    id: "1",
    title: "Tokyo Adventure",
    fromLocation: "Los Angeles, CA",
    toLocation: "Tokyo, Japan",
    startDate: "2025-03-15",
    endDate: "2025-03-25",
    budget: 4500,
    status: "PLANNING",
    isShared: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "European Road Trip",
    fromLocation: "Paris, France",
    toLocation: "Rome, Italy",
    startDate: "2025-06-01",
    endDate: "2025-06-14",
    budget: 6000,
    status: "PLANNING",
    isShared: true,
    shareToken: "abc123",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Weekend in NYC",
    fromLocation: "Boston, MA",
    toLocation: "New York City, NY",
    startDate: "2024-12-20",
    endDate: "2024-12-22",
    budget: 800,
    status: "COMPLETED",
    isShared: false,
    createdAt: new Date().toISOString(),
  },
];

export function SavedTripsPage() {
  const [trips, setTrips] = useState<TripType[]>(DEMO_TRIPS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.toLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || trip.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.success("Trip deleted");
  };

  const handleShare = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/trip/${id}`);
    toast.success("Share link copied!");
  };

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-brand-400" />
              Saved Trips
            </h1>
            <p className="text-muted-foreground mt-1">
              {trips.length} saved trips · {trips.filter((t) => t.status === "PLANNING").length} in planning
            </p>
          </div>
          <Link href="/route-planner">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Plan New Trip
            </Button>
          </Link>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Input
            placeholder="Search trips..."
            icon={<Search className="w-4 h-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 flex-1"
          />
          <div className="flex gap-2">
            {["all", "PLANNING", "ACTIVE", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  filter === status
                    ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                    : "bg-white/5 text-muted-foreground border border-border/30 hover:border-border"
                }`}
              >
                {status === "all" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Grid */}
        {filteredTrips.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={handleDelete}
                  onShare={handleShare}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-brand-500/10 flex items-center justify-center mb-6">
              <Plane className="w-10 h-10 text-brand-400 opacity-40" />
            </div>
            <h3 className="text-xl font-bold mb-2">No trips found</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              {searchQuery ? "No trips match your search." : "Start planning your first adventure!"}
            </p>
            <Link href="/route-planner">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Plan a Trip
              </Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
