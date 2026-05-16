"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Share2, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import type { TripType } from "@/types";

const STATUS_CONFIG = {
  PLANNING: { label: "Planning", variant: "default" as const },
  ACTIVE: { label: "Active", variant: "success" as const },
  COMPLETED: { label: "Completed", variant: "outline" as const },
  CANCELLED: { label: "Cancelled", variant: "destructive" as const },
};

interface TripCardProps {
  trip: TripType;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export function TripCard({ trip, onDelete, onShare, className }: TripCardProps) {
  const statusConfig = STATUS_CONFIG[trip.status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-2xl border border-border/50 bg-card overflow-hidden group transition-shadow hover:shadow-xl hover:shadow-black/20",
        className
      )}
    >
      {/* Gradient header */}
      <div className="relative h-32 bg-gradient-to-br from-brand-900/50 to-teal-900/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-teal-500/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-20">✈️</div>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
        </div>
        <div className="absolute bottom-3 left-4">
          <h3 className="font-bold text-white text-lg leading-tight">{trip.title}</h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Route */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-4 h-4 text-brand-400" />
            <span className="truncate max-w-[120px]">{trip.fromLocation}</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="truncate max-w-[120px]">{trip.toLocation}</span>
          </div>
        </div>

        {/* Dates */}
        {trip.startDate && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {format(new Date(trip.startDate), "MMM d")}
              {trip.endDate && ` – ${format(new Date(trip.endDate), "MMM d, yyyy")}`}
            </span>
          </div>
        )}

        {/* Budget */}
        {trip.budget && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Budget: {formatCurrency(trip.budget)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 gap-1.5 text-xs h-8"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Trip
          </Button>
          {onShare && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => onShare(trip.id)}
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onDelete(trip.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
