"use client";

import { motion } from "framer-motion";
import { MapPin, Star, ExternalLink, Phone, Clock, Gem } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { AttractionType } from "@/types";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/types";

interface AttractionCardProps {
  attraction: AttractionType;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AttractionCard({
  attraction,
  isSelected,
  onClick,
  className,
}: AttractionCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden",
        isSelected
          ? "border-brand-500/50 bg-brand-500/5 shadow-lg shadow-brand-500/10"
          : "border-border/50 bg-card hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5",
        className
      )}
    >
      {/* Category accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm",
              isSelected ? "bg-brand-500/20" : "bg-white/5"
            )}
          >
            {CATEGORY_ICONS[attraction.category] || "📍"}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate pr-2">
              {attraction.name}
            </h3>
            {attraction.address && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {attraction.address}
              </p>
            )}
          </div>
          {attraction.isHiddenGem && (
            <Badge variant="gem" className="flex-shrink-0">
              <Gem className="w-3 h-3" />
              Gem
            </Badge>
          )}
        </div>

        {/* Description */}
        {attraction.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {attraction.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {CATEGORY_LABELS[attraction.category as keyof typeof CATEGORY_LABELS] ||
              attraction.category}
          </Badge>

          {attraction.rating && (
            <div className="flex items-center gap-1 text-amber-400 text-xs">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{attraction.rating.toFixed(1)}</span>
            </div>
          )}

          {attraction.distance !== undefined && (
            <span className="text-xs text-muted-foreground ml-auto">
              {attraction.distance < 1
                ? `${(attraction.distance * 1000).toFixed(0)}m`
                : `${attraction.distance.toFixed(1)}km`}
            </span>
          )}
        </div>

        {/* Links row */}
        {(attraction.website || attraction.phone || attraction.openingHours) && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border/30">
            {attraction.openingHours && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {attraction.openingHours.split(";")[0]}
              </span>
            )}
            {attraction.phone && (
              <a
                href={`tel:${attraction.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors"
              >
                <Phone className="w-3 h-3" />
                Call
              </a>
            )}
            {attraction.website && (
              <a
                href={attraction.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-colors ml-auto"
              >
                <ExternalLink className="w-3 h-3" />
                Visit
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
