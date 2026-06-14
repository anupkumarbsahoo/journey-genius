"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import {
  Route,
  Navigation,
  Fuel,
  Clock,
  MapPin,
  Zap,
  Utensils,
  Mountain,
  DollarSign,
  ArrowRight,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MapView } from "@/components/map/MapView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PlaceAutocomplete } from "@/components/ui/PlaceAutocomplete";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useRoute } from "@/hooks/useRoute";
import { formatDistance, formatDuration, estimateFuelCost } from "@/lib/utils";
import toast from "react-hot-toast";
import type { AttractionType, MapViewState } from "@/types";

interface RouteOptions {
  scenic: boolean;
  showAttractions: boolean;
  showRestaurants: boolean;
  showFuelStops: boolean;
  mpg: number;
  fuelPrice: number;
}

export function RoutePlannerPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [options, setOptions] = useState<RouteOptions>({
    scenic: false,
    showAttractions: true,
    showRestaurants: true,
    showFuelStops: true,
    mpg: 30,
    fuelPrice: 3.5,
  });
  const [viewState, setViewState] = useState<MapViewState>({
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 4,
  });
  const [allAttractions, setAllAttractions] = useState<AttractionType[]>([]);
  const prevScenicRef = useRef(false);
  const { route, loading, fetchRoute, clearRoute } = useRoute();

  // Fetch ALL attraction types once when route changes — filter client-side on toggle
  useEffect(() => {
    if (!route) { setAllAttractions([]); return; }
    const coords = route.geometry.coordinates;
    const midIdx = Math.floor(coords.length / 2);
    const [midLon, midLat] = coords[midIdx] as [number, number];
    fetch(`/api/attractions?lat=${midLat}&lon=${midLon}&radius=10&categories=tourism,restaurant,gas_station`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setAllAttractions(data?.attractions?.slice(0, 50) || []))
      .catch(() => {});
  }, [route]);

  // Instant client-side filter when options toggle — no API call needed
  const routeAttractions = useMemo(
    () =>
      allAttractions.filter((a) => {
        if (a.category === "tourism" && !options.showAttractions) return false;
        if (a.category === "restaurant" && !options.showRestaurants) return false;
        if (a.category === "gas_station" && !options.showFuelStops) return false;
        return true;
      }),
    [allAttractions, options.showAttractions, options.showRestaurants, options.showFuelStops]
  );

  // Auto-recalculate route when scenic option is toggled (if route already exists)
  useEffect(() => {
    if (prevScenicRef.current === options.scenic) return;
    prevScenicRef.current = options.scenic;
    if (!route || !from.trim() || !to.trim()) return;
    fetchRoute(from, to, { scenic: options.scenic });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.scenic]);

  const handlePlanRoute = async () => {
    if (!from.trim() || !to.trim()) {
      toast.error("Please enter both origin and destination");
      return;
    }

    const result = await fetchRoute(from, to, { scenic: options.scenic });
    if (!result) {
      toast.error("Could not calculate route. Check your locations.");
      return;
    }

    toast.success("Route calculated successfully!");

    // Fly map to fit the route
    const coords = result.geometry.coordinates as [number, number][];
    if (coords.length > 0) {
      const lons = coords.map((c) => c[0]);
      const lats = coords.map((c) => c[1]);
      const midLon = (Math.min(...lons) + Math.max(...lons)) / 2;
      const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      const span = Math.max(
        Math.max(...lons) - Math.min(...lons),
        Math.max(...lats) - Math.min(...lats)
      );
      const zoom = Math.max(4, Math.min(10, Math.log2(120 / Math.max(span, 0.01))));
      setViewState({ latitude: midLat, longitude: midLon, zoom });
    }
  };

  const fuelCost = route
    ? estimateFuelCost(route.distance / 1000, options.mpg, options.fuelPrice)
    : 0;

  return (
    <div className="min-h-screen animated-gradient">
      <Navbar />
      <div className="pt-16 flex flex-col lg:flex-row h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full lg:w-96 flex-shrink-0 bg-background/80 backdrop-blur-xl border-r border-border/50 flex flex-col overflow-y-auto"
        >
          <div className="p-6 border-b border-border/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <Route className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Route Planner</h1>
                <p className="text-xs text-muted-foreground">Optimized routes with AI insights</p>
              </div>
            </div>

            {/* From / To inputs */}
            <div className="space-y-3">
              <PlaceAutocomplete
                placeholder="From: City, Address, or Place"
                icon={<div className="w-2.5 h-2.5 rounded-full bg-brand-400" />}
                value={from}
                onChange={setFrom}
                className="bg-white/5"
              />

              <div className="flex justify-center">
                <div className="w-px h-4 bg-border/50" />
              </div>

              <PlaceAutocomplete
                placeholder="To: City, Address, or Place"
                icon={<div className="w-2.5 h-2.5 rounded-full bg-teal-400" />}
                value={to}
                onChange={setTo}
                className="bg-white/5"
              />
            </div>

            {/* Options */}
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Route Options</p>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "scenic", label: "Scenic Route", icon: Mountain },
                  { key: "showAttractions", label: "Attractions", icon: MapPin },
                  { key: "showRestaurants", label: "Restaurants", icon: Utensils },
                  { key: "showFuelStops", label: "Fuel Stops", icon: Fuel },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setOptions((o) => ({ ...o, [key]: !o[key as keyof RouteOptions] }))}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      options[key as keyof RouteOptions]
                        ? "border-brand-500/50 bg-brand-500/10 text-brand-400"
                        : "border-border/30 bg-white/3 text-muted-foreground hover:border-border"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Fuel calculator inputs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">MPG</label>
                  <Input
                    type="number"
                    value={options.mpg}
                    onChange={(e) => setOptions((o) => ({ ...o, mpg: Number(e.target.value) }))}
                    className="bg-white/5 h-8 text-xs"
                    min={5}
                    max={100}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">$/Gallon</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={options.fuelPrice}
                    onChange={(e) => setOptions((o) => ({ ...o, fuelPrice: Number(e.target.value) }))}
                    className="bg-white/5 h-8 text-xs"
                    min={1}
                    max={10}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handlePlanRoute}
              loading={loading}
              className="w-full mt-4 gap-2"
            >
              <Navigation className="w-4 h-4" />
              Calculate Route
            </Button>
          </div>

          {/* Route Results */}
          {route && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-4"
            >
              <h2 className="font-semibold text-sm">Route Summary</h2>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-white/3 border-border/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Navigation className="w-3.5 h-3.5 text-brand-400" />
                      <span className="text-xs text-muted-foreground">Distance</span>
                    </div>
                    <div className="font-bold text-lg">{formatDistance(route.distance)}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/3 border-border/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-xs text-muted-foreground">Duration</span>
                    </div>
                    <div className="font-bold text-lg">{formatDuration(route.duration)}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/3 border-border/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs text-muted-foreground">Est. Fuel Cost</span>
                    </div>
                    <div className="font-bold text-lg">${fuelCost.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card className="bg-white/3 border-border/30">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Fuel className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-xs text-muted-foreground">Fuel Needed</span>
                    </div>
                    <div className="font-bold text-lg">
                      {((route.distance / 1000) * 0.621371 / options.mpg).toFixed(1)}g
                    </div>
                  </CardContent>
                </Card>
              </div>

              {options.scenic && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                  <Mountain className="w-4 h-4 text-teal-400 flex-shrink-0" />
                  <p className="text-xs text-teal-300">Scenic route selected — enjoy beautiful landscapes along the way!</p>
                </div>
              )}

              {/* Route legs */}
              {route.legs.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Route Legs</h3>
                  <div className="space-y-2">
                    {route.legs.map((leg, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/3">
                        <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-xs font-bold text-brand-400">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{leg.summary || `Segment ${i + 1}`}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistance(leg.distance)} · {formatDuration(leg.duration)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attractions along route */}
              {routeAttractions.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Along Your Route ({routeAttractions.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto no-scrollbar">
                    {routeAttractions.map((a) => (
                      <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/3 border border-border/20">
                        <span className="text-base">{a.category === "restaurant" ? "🍽️" : a.category === "gas_station" ? "⛽" : "📍"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{a.name}</p>
                          {a.address && <p className="text-xs text-muted-foreground truncate">{a.address}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!route && !loading && (
            <div className="p-6 flex flex-col items-center justify-center text-center text-muted-foreground flex-1">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4">
                <Route className="w-8 h-8 text-teal-400 opacity-50" />
              </div>
              <p className="text-sm font-medium">Enter your route</p>
              <p className="text-xs mt-1">Fill in origin and destination to calculate the optimal route with fuel costs.</p>
            </div>
          )}
        </motion.aside>

        {/* Map */}
        <div className="flex-1">
          <MapView
            viewState={viewState}
            onViewStateChange={setViewState}
            attractions={routeAttractions}
            route={route?.geometry || null}
            height="100%"
            className="rounded-none"
          />
        </div>
      </div>
    </div>
  );
}
