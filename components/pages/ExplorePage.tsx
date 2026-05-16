"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  SlidersHorizontal,
  RefreshCw,
  Locate,
  ChevronLeft,
  ChevronRight,
  Gem,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MapView } from "@/components/map/MapView";
import { AttractionCard } from "@/components/cards/AttractionCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { AttractionCardSkeleton } from "@/components/ui/Skeleton";
import { WeatherWidget } from "@/components/shared/WeatherWidget";
import { useAttractions } from "@/hooks/useAttractions";
import { useGeolocation } from "@/hooks/useGeolocation";
import { CATEGORY_LABELS, CATEGORY_ICONS } from "@/types";
import type { AttractionType, FilterState, MapViewState } from "@/types";
import { debounce } from "@/lib/utils";
import toast from "react-hot-toast";

const DEFAULT_CATEGORIES = ["tourism", "restaurant", "park"];

const ALL_CATEGORIES = Object.entries(CATEGORY_LABELS);

const RADIUS_OPTIONS = [1, 2, 5, 10, 25, 50];

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionType | null>(null);
  const [viewState, setViewState] = useState<MapViewState>({
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 11,
  });
  const [filters, setFilters] = useState<FilterState>({
    categories: DEFAULT_CATEGORIES,
    radiusMiles: 5,
    showHiddenGems: false,
    minRating: 0,
  });

  const { attractions, loading, fetchAttractions } = useAttractions();
  const { getLocation, loading: geoLoading } = useGeolocation();

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
          { headers: { "User-Agent": "WanderPilot-AI/1.0" } }
        );
        const data = await res.json();
        if (data[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setViewState({ latitude: lat, longitude: lon, zoom: 12 });
          fetchAttractions(lat, lon, filters);
        } else {
          toast.error("Location not found");
        }
      } catch {
        toast.error("Search failed");
      }
    }, 600),
    [filters, fetchAttractions]
  );

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setViewState({ latitude, longitude, zoom: 12 });
        fetchAttractions(latitude, longitude, filters);
        toast.success("Location found!");
      },
      () => toast.error("Unable to get your location")
    );
  };

  const handleApplyFilters = () => {
    fetchAttractions(viewState.latitude, viewState.longitude, filters);
    setFilterOpen(false);
    toast.success(`Showing ${filters.categories.length} categories within ${filters.radiusMiles}mi`);
  };

  const toggleCategory = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden animated-gradient">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-80 xl:w-96 flex-shrink-0 bg-background/80 backdrop-blur-xl border-r border-border/50 flex flex-col overflow-hidden z-20"
            >
              {/* Search */}
              <div className="p-4 border-b border-border/30">
                <Input
                  placeholder="Search location..."
                  icon={<Search className="w-4 h-4" />}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    handleSearch(e.target.value);
                  }}
                  className="bg-white/5 border-border/30"
                />
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="glass"
                    onClick={handleLocateMe}
                    loading={geoLoading}
                    className="flex-1 gap-1.5 text-xs"
                  >
                    <Locate className="w-3.5 h-3.5" />
                    My Location
                  </Button>
                  <Button
                    size="sm"
                    variant="glass"
                    onClick={() => setFilterOpen(!filterOpen)}
                    className={`gap-1.5 text-xs ${filterOpen ? "border-brand-500/50 text-brand-400" : ""}`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Filters
                  </Button>
                  <Button
                    size="sm"
                    variant="glass"
                    onClick={() => fetchAttractions(viewState.latitude, viewState.longitude, filters)}
                    className="w-8 h-8 p-0"
                    title="Refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Filter Panel */}
              <AnimatePresence>
                {filterOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-border/30 overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      {/* Categories */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                          Categories
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {ALL_CATEGORIES.map(([key, label]) => (
                            <button
                              key={key}
                              onClick={() => toggleCategory(key)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                filters.categories.includes(key)
                                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                                  : "bg-white/5 text-muted-foreground border border-border/30 hover:border-border"
                              }`}
                            >
                              {CATEGORY_ICONS[key]}
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Radius */}
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                          Radius: {filters.radiusMiles} miles
                        </label>
                        <div className="flex gap-2">
                          {RADIUS_OPTIONS.map((r) => (
                            <button
                              key={r}
                              onClick={() => setFilters((f) => ({ ...f, radiusMiles: r }))}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                filters.radiusMiles === r
                                  ? "bg-brand-500/20 text-brand-400 border border-brand-500/30"
                                  : "bg-white/5 text-muted-foreground border border-border/30"
                              }`}
                            >
                              {r}mi
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hidden Gems toggle */}
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Gem className="w-3.5 h-3.5 text-purple-400" />
                          Show Hidden Gems
                        </label>
                        <button
                          onClick={() => setFilters((f) => ({ ...f, showHiddenGems: !f.showHiddenGems }))}
                          className={`w-10 h-5 rounded-full transition-all ${
                            filters.showHiddenGems ? "bg-purple-500" : "bg-white/10"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform m-0.5 ${filters.showHiddenGems ? "translate-x-5" : ""}`} />
                        </button>
                      </div>

                      <Button onClick={handleApplyFilters} className="w-full" size="sm">
                        <Filter className="w-3.5 h-3.5 mr-1.5" />
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results header */}
              <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span className="text-sm font-medium">
                    {loading ? "Searching..." : `${attractions.length} places found`}
                  </span>
                </div>
                {filters.showHiddenGems && (
                  <Badge variant="gem">
                    <Gem className="w-3 h-3" /> Gems on
                  </Badge>
                )}
              </div>

              {/* Attraction List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => <AttractionCardSkeleton key={i} />)
                ) : attractions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">Search a location to discover places</p>
                    <Button
                      variant="glass"
                      size="sm"
                      className="mt-4 gap-1.5"
                      onClick={handleLocateMe}
                    >
                      <Locate className="w-4 h-4" />
                      Use my location
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {attractions.map((attraction) => (
                      <AttractionCard
                        key={attraction.id}
                        attraction={attraction}
                        isSelected={selectedAttraction?.id === attraction.id}
                        onClick={() => {
                          setSelectedAttraction(attraction);
                          setViewState((s) => ({
                            ...s,
                            latitude: attraction.latitude,
                            longitude: attraction.longitude,
                            zoom: Math.max(s.zoom, 14),
                          }));
                        }}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Weather Widget at bottom */}
              {!loading && attractions.length > 0 && (
                <div className="p-4 border-t border-border/30">
                  <WeatherWidget lat={viewState.latitude} lon={viewState.longitude} />
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-6 h-12 bg-background/80 backdrop-blur border border-border/50 border-l-0 rounded-r-lg flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          style={{ left: sidebarOpen ? "320px" : "0" }}
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            viewState={viewState}
            onViewStateChange={setViewState}
            attractions={attractions}
            selectedAttraction={selectedAttraction}
            onAttractionClick={setSelectedAttraction}
            height="100%"
            className="rounded-none"
          />

          {/* Map overlay hint */}
          {attractions.length === 0 && !loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="glass-card rounded-2xl p-6 text-center max-w-sm pointer-events-auto">
                <Search className="w-12 h-12 mx-auto mb-3 text-brand-400 opacity-50" />
                <h3 className="font-semibold mb-2">Explore any location</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Search a city or use your current location to discover attractions nearby.
                </p>
                <Button onClick={handleLocateMe} size="sm" className="gap-1.5">
                  <Locate className="w-4 h-4" />
                  Use My Location
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
