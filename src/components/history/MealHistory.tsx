"use client";

import { motion } from "framer-motion";
import type { MealHistory as MealHistoryType } from "@/types/database";

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-xs text-text-muted">—</span>;
  return (
    <span className="text-xs">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-accent-gold" : "text-text-muted/20"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function MealHistoryView({
  meals,
  onMealTap,
}: {
  meals: MealHistoryType[];
  onMealTap?: (meal: MealHistoryType) => void;
}) {
  if (meals.length === 0) {
    return (
      <div className="px-5 py-20 text-center">
        <span className="text-5xl block mb-4">📖</span>
        <p className="text-text-secondary">Noch keine Gerichte gekocht</p>
        <p className="text-text-muted text-sm mt-1">
          Hier erscheinen eure gemeinsamen Abendessen
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-24">
      <h2 className="text-sm text-text-muted uppercase tracking-wider mb-4 pt-4">
        Vergangene Gerichte
      </h2>

      {/* Photo grid */}
      <div className="grid grid-cols-2 gap-3">
        {meals.map((meal, i) => (
          <motion.button
            key={meal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onMealTap?.(meal)}
            className="rounded-2xl overflow-hidden bg-bg-card"
          >
            {/* Image */}
            <div className="aspect-square relative">
              {meal.image_url ? (
                <img
                  src={meal.image_url}
                  alt={meal.meal_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-bg-elevated to-bg-card flex items-center justify-center">
                  <span className="text-4xl opacity-20">🍽️</span>
                </div>
              )}

              {/* Would not repeat badge */}
              {meal.would_repeat === false && (
                <span className="absolute top-2 right-2 bg-accent-red/80 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                  Nie wieder
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-sm font-medium text-text-primary truncate">
                {meal.meal_name}
              </p>
              <p className="text-[11px] text-text-muted mt-0.5">
                {new Date(meal.date_cooked + "T00:00:00").toLocaleDateString("de-DE", {
                  day: "numeric",
                  month: "short",
                })}
              </p>

              {/* Ratings */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-text-muted">Adrian</span>
                  <StarRating rating={meal.rating_adrian} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-text-muted">Janina</span>
                  <StarRating rating={meal.rating_janina} />
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
