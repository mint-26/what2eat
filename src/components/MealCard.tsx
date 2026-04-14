"use client";

import { motion } from "framer-motion";
import type { DailySuggestion, UserRole } from "@/types/database";

function SpiceLevel({ level }: { level: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < level ? "opacity-100" : "opacity-20"}>
          🌶️
        </span>
      ))}
    </span>
  );
}

export function MealCard({
  suggestion,
  currentUser,
  isSelected,
  onSelect,
}: {
  suggestion: DailySuggestion;
  currentUser: UserRole;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const calories =
    currentUser === "adrian"
      ? suggestion.calories_adrian
      : suggestion.calories_janina;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      animate={isSelected ? { scale: 1.02, boxShadow: "0 0 30px rgba(212, 168, 67, 0.3)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={onSelect}
      className={`
        relative rounded-2xl overflow-hidden bg-bg-card border-2 transition-colors
        ${isSelected ? "border-accent-gold" : "border-transparent"}
        snap-center shrink-0 w-[calc(100vw-48px)] max-w-[345px]
      `}
    >
      {/* Meal Image or Placeholder */}
      <div className="relative h-52 bg-gradient-to-br from-bg-elevated to-bg-card overflow-hidden">
        {suggestion.meal_image_url ? (
          <img
            src={suggestion.meal_image_url}
            alt={suggestion.meal_name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🍽️</span>
          </div>
        )}

        {/* Cuisine badge */}
        {suggestion.cuisine_type && (
          <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-xs px-2.5 py-1 rounded-full text-text-primary">
            {suggestion.cuisine_type}
          </span>
        )}

        {/* Selected checkmark */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center"
          >
            <span className="text-bg-primary text-sm font-bold">✓</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-text-primary leading-tight">
          {suggestion.meal_name}
        </h3>
        {suggestion.meal_description && (
          <p className="text-text-secondary text-sm mt-1 line-clamp-2">
            {suggestion.meal_description}
          </p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
          {calories && (
            <span className="flex items-center gap-1">
              <span className="text-accent-red">🔥</span> {calories} kcal
            </span>
          )}
          {suggestion.protein_grams && (
            <span className="flex items-center gap-1">
              <span>💪</span> {suggestion.protein_grams}g
            </span>
          )}
          {suggestion.prep_time_minutes && (
            <span className="flex items-center gap-1">
              <span>⏱️</span> {suggestion.prep_time_minutes} Min
            </span>
          )}
        </div>

        {/* Spice level */}
        {suggestion.spice_level && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-text-muted uppercase tracking-wider">Schärfe</span>
            <SpiceLevel level={suggestion.spice_level} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
