"use client";

import { useState, useCallback } from "react";
import type { AttractionType, FilterState } from "@/types";

export function useAttractions() {
  const [attractions, setAttractions] = useState<AttractionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttractions = useCallback(
    async (lat: number, lon: number, filters: FilterState) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          radius: filters.radiusMiles.toString(),
          categories: filters.categories.join(","),
        });

        const res = await fetch(`/api/attractions?${params}`);
        if (!res.ok) throw new Error("Failed to fetch attractions");
        const data = await res.json();

        let results: AttractionType[] = data.attractions || [];

        if (filters.showHiddenGems) {
          results = results.map((a, i) => ({
            ...a,
            isHiddenGem: i % 7 === 0,
          }));
        }

        if (filters.minRating > 0) {
          results = results.filter(
            (a) => !a.rating || a.rating >= filters.minRating
          );
        }

        setAttractions(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { attractions, loading, error, fetchAttractions, setAttractions };
}
