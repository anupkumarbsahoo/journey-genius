"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Coffee,
  Utensils,
  Moon,
  Hotel,
  Home,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
  RefreshCw,
  Plane,
  Car,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ItineraryDaySkeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";
import type { ItineraryData, ItineraryDay, Activity } from "@/types";

const INTERESTS = [
  "Culture & History", "Food & Cuisine", "Adventure", "Nature & Outdoors",
  "Art & Museums", "Shopping", "Nightlife", "Photography", "Relaxation", "Sports",
];

const TRAVEL_STYLES = [
  { value: "budget", label: "Budget", icon: "💰" },
  { value: "standard", label: "Standard", icon: "✈️" },
  { value: "luxury", label: "Luxury", icon: "💎" },
  { value: "backpacker", label: "Backpacker", icon: "🎒" },
];

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group">
      <div className="flex-shrink-0 flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center">
          <Clock className="w-4 h-4 text-brand-400" />
        </div>
        <div className="w-px flex-1 bg-border/20" />
      </div>
      <div className="flex-1 pb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-brand-400">{activity.time}</span>
          {activity.cost > 0 && (
            <Badge variant="outline" className="text-xs">
              ${activity.cost}
            </Badge>
          )}
        </div>
        <h4 className="font-semibold text-sm mb-1">{activity.name}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{activity.description}</p>
        {activity.tips && (
          <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 text-xs">💡</span>
            <p className="text-xs text-amber-200/80">{activity.tips}</p>
          </div>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">{activity.category}</Badge>
          <span className="text-xs text-muted-foreground">⏱ {activity.duration}</span>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, isExpanded, onToggle, travelMode, origin, destinationCity }: {
  day: ItineraryDay;
  isExpanded: boolean;
  onToggle: () => void;
  travelMode?: 'car' | 'flight';
  origin?: string;
  destinationCity?: string;
}) {
  const isDriveThere = day.dayType === 'drive_there' || day.activities.some(a => a.name.includes('🚗 En Route:'));
  const isDriveBack = day.dayType === 'drive_back' || day.activities.some(a => a.name.includes('🔄 Return:'));
  const isDriveDay = isDriveThere || isDriveBack;
  const isReturningHome = isDriveBack && day.hotel?.pricePerNight === 0;
  const totalActivitiesCost = day.activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/50 bg-card overflow-hidden"
    >
      {/* Day header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-white/3 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-teal-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-brand-500/20">
            {day.day}
          </div>
          <div>
            <div className="font-bold">{day.date}</div>
            <div className="text-sm text-muted-foreground">{day.theme}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline">${totalActivitiesCost + day.hotel.pricePerNight}/day</Badge>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30">
              {/* Drive day route banner */}
              {isDriveDay && (
                <div className="mx-5 mt-5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center gap-3">
                  <Car className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-teal-300">
                      {isDriveThere
                        ? `Road Trip: ${origin || 'Origin'} → ${destinationCity || 'Destination'}`
                        : `Return Drive: ${destinationCity || 'Destination'} → ${origin || 'Home'}`}
                    </p>
                    <p className="text-xs text-teal-400/70 mt-0.5">
                      {isDriveThere
                        ? 'Meals and stops are along the driving route — not at the destination yet.'
                        : 'Meals and stops are along the return route home.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Meals */}
              <div className="p-5 border-b border-border/20">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  {isDriveDay ? 'Meals Along the Route' : 'Dining Recommendations'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: Coffee, label: "Breakfast", meal: day.meals.breakfast },
                    { icon: Utensils, label: "Lunch", meal: day.meals.lunch },
                    { icon: Moon, label: "Dinner", meal: day.meals.dinner },
                  ].map(({ icon: Icon, label, meal }) => (
                    <div key={label} className="p-3 rounded-xl bg-white/3 border border-border/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-teal-400" />
                        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                      </div>
                      <p className="font-medium text-sm">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.cuisine}</p>
                      <Badge variant="outline" className="mt-1.5 text-xs">{meal.priceRange}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div className="p-5 border-b border-border/20">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {isDriveDay ? 'Route & Stops' : 'Day Schedule'}
                </h3>
                <div className="space-y-1">
                  {day.activities.map((activity, i) => (
                    <ActivityItem key={i} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Hotel */}
              <div className="p-5 border-b border-border/20">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Accommodation
                </h3>
                {isReturningHome ? (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="w-12 h-12 rounded-xl bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-300">Returning Home</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">No accommodation needed — you're back home today!</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-border/20">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center flex-shrink-0">
                      <Hotel className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{day.hotel.name}</h4>
                        <div className="text-amber-400 text-xs">
                          {"★".repeat(day.hotel.stars)}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{day.hotel.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {day.hotel.amenities.slice(0, 3).map((a) => (
                            <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                          ))}
                        </div>
                        <span className="font-bold text-teal-400 text-sm">
                          ${day.hotel.pricePerNight}/night
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transport tips */}
              {day.transportTips && (
                <div className="p-5">
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20">
                    {travelMode === 'car' ? (
                      <Car className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Plane className="w-4 h-4 text-brand-400 mt-0.5 flex-shrink-0" />
                    )}
                    <p className="text-xs text-brand-200/80">{day.transportTips}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ItineraryPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState<'car' | 'flight'>('flight');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(2000);
  const [attractionsPerDay, setAttractionsPerDay] = useState(4);
  const [radiusMiles, setRadiusMiles] = useState(20);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Culture & History", "Food & Cuisine"]);
  const [travelStyle, setTravelStyle] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  };

  const generateItinerary = async () => {
    if (!destination.trim()) {
      toast.error("Please enter a destination");
      return;
    }
    if (selectedInterests.length === 0) {
      toast.error("Please select at least one interest");
      return;
    }

    setLoading(true);
    setItinerary(null);

    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days,
          budget,
          interests: selectedInterests,
          travelStyle,
          attractionsPerDay,
          radiusMiles,
          origin: origin.trim() || undefined,
          travelMode,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate itinerary");
      const data = await res.json();
      setItinerary(data.itinerary);
      setExpandedDays(new Set([1]));
      toast.success("Itinerary generated successfully!");
    } catch (err) {
      toast.error("Failed to generate itinerary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    toast.success("PDF export coming soon!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span className="text-sm text-brand-300">Powered by Groq AI & Gemini</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            AI <span className="gradient-text">Itinerary Generator</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get a personalized day-by-day travel plan with meals, hotels, activities, and timing — all tailored to your budget and interests.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="bg-card/50 backdrop-blur-sm sticky top-20">
              <CardContent className="p-6 space-y-6">
                {/* Origin */}
                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    Origin
                    <span className="text-xs font-normal text-muted-foreground ml-1">(optional)</span>
                  </label>
                  <PlaceAutocomplete
                    placeholder="e.g. New York, Chicago..."
                    value={origin}
                    onChange={setOrigin}
                    className="bg-white/5"
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="text-sm font-semibold mb-2 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-400" />
                    Destination
                  </label>
                  <PlaceAutocomplete
                    placeholder="e.g. Tokyo, Paris, New York..."
                    value={destination}
                    onChange={setDestination}
                    className="bg-white/5"
                  />
                </div>

                {/* Mode of Travel */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">Mode of Travel</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTravelMode('car')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium border transition-all ${
                        travelMode === 'car'
                          ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                          : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      Car
                    </button>
                    <button
                      onClick={() => setTravelMode('flight')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium border transition-all ${
                        travelMode === 'flight'
                          ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                          : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                      }`}
                    >
                      <Plane className="w-4 h-4" />
                      Flight
                    </button>
                  </div>
                  {travelMode === 'car' && (
                    <p className="text-xs text-teal-400 mt-2">
                      🚗 Day 1 = drive to destination · Last day = drive back home
                      {origin ? ` from ${origin}` : " — add an origin city above for best results"}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    Duration: <span className="text-brand-400">{days} days</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 day</span>
                    <span>14 days</span>
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    Total Budget: <span className="text-brand-400">{formatCurrency(budget)}</span>
                  </label>
                  <input
                    type="range"
                    min={200}
                    max={20000}
                    step={100}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>$200</span>
                    <span>$20,000</span>
                  </div>
                </div>

                {/* Attractions per day */}
                <div>
                  <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400" />
                    Attractions per day: <span className="text-brand-400">{attractionsPerDay}</span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      {attractionsPerDay <= 2 ? "(Light)" : attractionsPerDay <= 4 ? "(Standard)" : "(Packed)"}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={6}
                    value={attractionsPerDay}
                    onChange={(e) => setAttractionsPerDay(Number(e.target.value))}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Light (2)</span>
                    <span>Standard (4)</span>
                    <span>Packed (6)</span>
                  </div>
                </div>

                {/* Attraction Radius */}
                <div>
                  <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-400" />
                    Attraction radius: <span className="text-brand-400">{radiusMiles} mi</span>
                    <span className="text-xs text-muted-foreground font-normal ml-1">
                      {radiusMiles <= 10 ? "(City centre)" : radiusMiles <= 30 ? "(City & suburbs)" : radiusMiles <= 60 ? "(Regional)" : "(Wide region)"}
                    </span>
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    step={5}
                    value={radiusMiles}
                    onChange={(e) => setRadiusMiles(Number(e.target.value))}
                    className="w-full accent-teal-500"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5 mi</span>
                    <span>50 mi</span>
                    <span>100 mi</span>
                  </div>
                </div>

                {/* Travel Style */}
                <div>
                  <label className="text-sm font-semibold mb-3 block">Travel Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TRAVEL_STYLES.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setTravelStyle(style.value)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                          travelStyle === style.value
                            ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                            : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                        }`}
                      >
                        <span>{style.icon}</span>
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="text-sm font-semibold mb-3 block flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    Interests ({selectedInterests.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                          selectedInterests.includes(interest)
                            ? "border-brand-500/50 bg-brand-500/15 text-brand-300"
                            : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={generateItinerary}
                  loading={loading}
                  size="lg"
                  className="w-full gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Itinerary
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Itinerary Display */}
          <div className="lg:col-span-2 space-y-6">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 glass rounded-full">
                    <div className="w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-brand-300">AI is crafting your perfect itinerary...</span>
                  </div>
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <ItineraryDaySkeleton key={i} />
                ))}
              </motion.div>
            )}

            {itinerary && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{itinerary.destination}</h2>
                      <p className="text-muted-foreground text-sm">
                        {itinerary.totalDays}-day itinerary · Est. {formatCurrency(itinerary.estimatedBudget)}
                      </p>
                      {travelMode === 'car' && origin && (
                        <p className="text-xs text-brand-400 mt-1">🚗 Road trip from {origin}</p>
                      )}
                      {itinerary.bestTimeToVisit && (
                        <p className="text-xs text-teal-400 mt-1">📅 {itinerary.bestTimeToVisit}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="glass" onClick={handleShare} className="gap-1.5">
                        <Share2 className="w-4 h-4" /> Share
                      </Button>
                      <Button size="sm" variant="glass" onClick={handleExportPDF} className="gap-1.5">
                        <Download className="w-4 h-4" /> Export PDF
                      </Button>
                      <Button size="sm" variant="glass" onClick={generateItinerary} className="gap-1.5">
                        <RefreshCw className="w-4 h-4" /> Regenerate
                      </Button>
                    </div>
                  </div>

                  {/* Weather note */}
                  {itinerary.weatherNote && (
                    <div className="mt-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-sm text-brand-200/80">
                      🌤 {itinerary.weatherNote}
                    </div>
                  )}

                  {/* Travel tips */}
                  {itinerary.travelTips?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pro Tips</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {itinerary.travelTips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <span className="text-brand-400 font-bold">✓</span>
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Day cards */}
                {itinerary.days?.map((day) => (
                  <DayCard
                    key={day.day}
                    day={day}
                    isExpanded={expandedDays.has(day.day)}
                    onToggle={() => toggleDay(day.day)}
                    travelMode={travelMode}
                    origin={origin || undefined}
                    destinationCity={destination || undefined}
                  />
                ))}
              </motion.div>
            )}

            {!itinerary && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-500/20 to-teal-500/10 flex items-center justify-center mb-6">
                  <BookOpen className="w-12 h-12 text-brand-400 opacity-50" />
                </div>
                <h3 className="text-xl font-bold mb-2">Your itinerary will appear here</h3>
                <p className="text-muted-foreground max-w-sm">
                  Fill in your destination, days, budget, and interests — then let AI create your perfect trip.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
