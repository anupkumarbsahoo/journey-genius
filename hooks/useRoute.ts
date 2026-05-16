"use client";

import { useState, useCallback } from "react";
import type { RouteType } from "@/types";

export function useRoute() {
  const [route, setRoute] = useState<RouteType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(
    async (from: string, to: string, options?: { scenic?: boolean }) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ from, to });
        if (options?.scenic) params.set("scenic", "true");

        const res = await fetch(`/api/routes?${params}`);
        if (!res.ok) throw new Error("Failed to calculate route");
        const data = await res.json();
        setRoute(data.route);
        return data.route as RouteType;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearRoute = useCallback(() => setRoute(null), []);

  return { route, loading, error, fetchRoute, clearRoute };
}
