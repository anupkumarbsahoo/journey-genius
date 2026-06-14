"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotonProperties {
  name?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  town?: string;
  village?: string;
  state?: string;
  country?: string;
  postcode?: string;
  type?: string;
}

interface PhotonFeature {
  geometry: { coordinates: [number, number] };
  properties: PhotonProperties;
}

export interface Place {
  label: string;      // bold title shown in dropdown
  sublabel: string;   // grey subtitle
  fieldValue: string; // populated in the input on select
  lat: number;
  lng: number;
}

function formatPhotonFeature(feature: PhotonFeature): Place {
  const p = feature.properties;
  const [lng, lat] = feature.geometry.coordinates;

  const name = p.name ?? "";
  const street = p.street ?? "";
  const houseNum = p.housenumber ?? "";
  const streetLine = houseNum && street ? `${houseNum} ${street}` : street;
  const city = p.city ?? p.town ?? p.village ?? "";
  const state = p.state ?? "";
  const country = p.country ?? "";

  // Bold label: named POI, or street address, or city
  const label = name || streetLine || city;

  // Subtitle: street (if name was the label), then city + state + country
  const subtitleParts: string[] = [];
  if (name && streetLine) subtitleParts.push(streetLine);
  if (city) subtitleParts.push(city);
  if (state) subtitleParts.push(state);
  if (country && country !== "United States") subtitleParts.push(country);
  const sublabel = subtitleParts.join(", ");

  // Field value: enough context for geocoding/display
  const fieldParts = [name || streetLine, city, state].filter(Boolean);
  const fieldValue = fieldParts.join(", ");

  return { label, sublabel, fieldValue, lat, lng };
}

interface PlaceAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (place: Place) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function PlaceAutocomplete({
  value,
  onChange,
  onSelect,
  onSubmit,
  placeholder,
  className,
  icon,
}: PlaceAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const features: PhotonFeature[] = data.features ?? [];
      const places = features
        .map(formatPhotonFeature)
        .filter((p) => p.label); // drop blank results
      setSuggestions(places);
      setOpen(places.length > 0);
      setHighlighted(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0) {
        selectPlace(suggestions[highlighted]);
      } else {
        setOpen(false);
        onSubmit?.(value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const selectPlace = (place: Place) => {
    onChange(place.fieldValue);
    onSelect?.(place);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            {icon}
          </div>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "flex h-10 w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all",
            icon && "pl-10",
            loading && "pr-9",
            className
          )}
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {suggestions.map((place, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                selectPlace(place);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3 text-sm text-left transition-colors border-b border-border/20 last:border-0",
                i === highlighted
                  ? "bg-brand-500/20 text-brand-400"
                  : "text-foreground hover:bg-white/5"
              )}
            >
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <p className="font-medium truncate">{place.label}</p>
                {place.sublabel && (
                  <p className="text-xs text-muted-foreground truncate">{place.sublabel}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
