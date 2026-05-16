"use client";

import { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { AttractionType, MapViewState } from "@/types";
import { CATEGORY_ICONS } from "@/types";

// Free map style — no API key required (OpenFreeMap)
const FREE_MAP_STYLE = "https://tiles.openfreemap.org/styles/dark";

interface MapViewProps {
  viewState: MapViewState;
  onViewStateChange?: (state: MapViewState) => void;
  attractions?: AttractionType[];
  selectedAttraction?: AttractionType | null;
  onAttractionClick?: (attraction: AttractionType) => void;
  route?: GeoJSON.LineString | null;
  routeColor?: string;
  height?: string;
  className?: string;
}

export function MapView({
  viewState,
  onViewStateChange,
  attractions = [],
  selectedAttraction,
  onAttractionClick,
  route,
  routeColor = "#0c8de4",
  height = "100%",
  className = "",
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: FREE_MAP_STYLE,
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(new maplibregl.FullscreenControl(), "top-right");
    map.current.addControl(
      new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }),
      "top-right"
    );

    map.current.on("load", () => setMapLoaded(true));

    map.current.on("move", () => {
      if (!map.current) return;
      const center = map.current.getCenter();
      onViewStateChange?.({
        latitude: center.lat,
        longitude: center.lng,
        zoom: map.current.getZoom(),
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Sync view state externally
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const center = map.current.getCenter();
    const currentZoom = map.current.getZoom();
    const latDiff = Math.abs(center.lat - viewState.latitude);
    const lonDiff = Math.abs(center.lng - viewState.longitude);
    const zoomDiff = Math.abs(currentZoom - viewState.zoom);
    if (latDiff > 0.001 || lonDiff > 0.001 || zoomDiff > 0.1) {
      map.current.flyTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        duration: 1200,
        essential: true,
      });
    }
  }, [viewState, mapLoaded]);

  // Render attraction markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    attractions.forEach((attraction) => {
      const el = document.createElement("div");
      const icon = CATEGORY_ICONS[attraction.category] || "📍";
      const isSelected = selectedAttraction?.id === attraction.id;

      el.innerHTML = `
        <div style="
          width: ${isSelected ? "44px" : "36px"};
          height: ${isSelected ? "44px" : "36px"};
          border-radius: 50%;
          background: ${isSelected
            ? "linear-gradient(135deg, #0c8de4, #2dd4bf)"
            : "rgba(15,20,40,0.9)"};
          border: 2px solid ${isSelected ? "#2dd4bf" : "rgba(255,255,255,0.2)"};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${isSelected ? "20px" : "16px"};
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4)${isSelected ? ", 0 0 20px rgba(12,141,228,0.4)" : ""};
          ${attraction.isHiddenGem ? "border-color: #a855f7;" : ""}
        ">${icon}</div>
      `;

      el.addEventListener("click", () => onAttractionClick?.(attraction));
      el.style.cursor = "pointer";

      const marker = new maplibregl.Marker(el)
        .setLngLat([attraction.longitude, attraction.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [attractions, selectedAttraction, mapLoaded, onAttractionClick]);

  // Render route
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    if (map.current.getSource("route")) {
      map.current.removeLayer("route-layer");
      map.current.removeLayer("route-glow");
      map.current.removeSource("route");
    }

    if (!route) return;

    map.current.addSource("route", {
      type: "geojson",
      data: { type: "Feature", properties: {}, geometry: route },
    });

    map.current.addLayer({
      id: "route-glow",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": routeColor, "line-width": 12, "line-opacity": 0.2, "line-blur": 4 },
    });

    map.current.addLayer({
      id: "route-layer",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": routeColor,
        "line-width": 4,
        "line-opacity": 0.9,
        "line-dasharray": [0, 0],
      },
    });

    const coords = route.coordinates as [number, number][];
    if (coords.length > 0) {
      const bounds = coords.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(coords[0], coords[0])
      );
      map.current.fitBounds(bounds, { padding: 60, duration: 1500 });
    }
  }, [route, routeColor, mapLoaded]);

  // Selected attraction popup
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    popupRef.current?.remove();

    if (!selectedAttraction) return;

    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      maxWidth: "280px",
    });

    popup.setHTML(`
      <div style="padding:16px;min-width:220px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:20px;">${CATEGORY_ICONS[selectedAttraction.category] || "📍"}</span>
          <strong style="color:white;font-size:14px;">${selectedAttraction.name}</strong>
        </div>
        ${selectedAttraction.address ? `<p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0 0 8px;">${selectedAttraction.address}</p>` : ""}
        ${selectedAttraction.rating ? `<div style="color:#f59e0b;font-size:12px;">★ ${selectedAttraction.rating.toFixed(1)}</div>` : ""}
        ${selectedAttraction.isHiddenGem ? `<span style="display:inline-block;margin-top:6px;padding:2px 8px;background:rgba(168,85,247,0.2);color:#c084fc;border-radius:999px;font-size:11px;">✨ Hidden Gem</span>` : ""}
      </div>
    `);

    popup
      .setLngLat([selectedAttraction.longitude, selectedAttraction.latitude])
      .addTo(map.current);

    popupRef.current = popup;
  }, [selectedAttraction, mapLoaded]);

  return (
    <div
      ref={mapContainer}
      className={`w-full rounded-2xl overflow-hidden ${className}`}
      style={{ height }}
    />
  );
}
