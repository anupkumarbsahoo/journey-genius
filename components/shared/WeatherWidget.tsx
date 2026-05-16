"use client";

import { useEffect, useState } from "react";
import { Thermometer, Wind, Droplets, Cloud } from "lucide-react";
import type { WeatherData } from "@/lib/weather";

interface WeatherWidgetProps {
  lat: number;
  lon: number;
  className?: string;
}

export function WeatherWidget({ lat, lon, className = "" }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className={`glass-card rounded-2xl p-4 animate-pulse ${className}`}>
        <div className="h-4 bg-white/5 rounded w-24 mb-2" />
        <div className="h-8 bg-white/5 rounded w-16" />
      </div>
    );
  }

  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className={`glass-card rounded-2xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <img src={iconUrl} alt={weather.description} className="w-12 h-12" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{weather.temp}°F</span>
            <span className="text-sm text-muted-foreground">Feels {weather.feelsLike}°</span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">{weather.description}</p>
          <p className="text-xs text-muted-foreground font-medium">{weather.city}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Droplets className="w-3 h-3 text-brand-400" />
          {weather.humidity}%
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Wind className="w-3 h-3 text-teal-400" />
          {weather.windSpeed} mph
        </div>
      </div>
    </div>
  );
}
