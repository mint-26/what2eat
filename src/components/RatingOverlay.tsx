"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserRole } from "@/types/database";

interface RatingOverlayProps {
  mealName: string;
  imageUrl?: string | null;
  currentUser: UserRole;
  onSave: (rating: number, wouldRepeat: boolean) => void;
  onSkip: () => void;
}

export function RatingOverlay({
  mealName,
  imageUrl,
  currentUser,
  onSave,
  onSkip,
}: RatingOverlayProps) {
  const [rating, setRating] = useState<number>(0);
  const [wouldRepeat, setWouldRepeat] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const labels = ["", "Nicht so gut", "Geht so", "War OK", "Hat geschmeckt!", "Absolut lecker! 🤤"];
  const displayRating = hoveredStar || rating;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary/97 backdrop-blur-xl px-6 safe-top safe-bottom"
    >
      {/* Meal image */}
      <div className="w-32 h-32 rounded-3xl overflow-hidden mb-5 shadow-2xl shadow-black/50">
        {imageUrl ? (
          <img src={imageUrl} alt={mealName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bg-card to-bg-elevated flex items-center justify-center">
            <span className="text-5xl opacity-30">🍽️</span>
          </div>
        )}
      </div>

      <p className="text-text-muted text-xs uppercase tracking-widest mb-2">
        Wie war das Essen?
      </p>
      <h2 className="font-display text-xl font-bold text-text-primary text-center mb-8 leading-tight">
        {mealName}
      </h2>

      {/* Stars */}
      <div className="flex gap-3 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
            whileTap={{ scale: 1.3 }}
            className={`text-4xl transition-all ${
              star <= displayRating ? "opacity-100" : "opacity-20"
            }`}
          >
            ⭐
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={displayRating}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-accent-gold text-sm h-5 mb-8"
        >
          {labels[displayRating]}
        </motion.p>
      </AnimatePresence>

      {/* Would repeat */}
      <button
        onClick={() => setWouldRepeat(!wouldRepeat)}
        className={`w-full max-w-xs flex items-center justify-between px-5 py-3.5 rounded-2xl border mb-8 transition-colors ${
          wouldRepeat
            ? "border-accent-green/40 bg-accent-green/10"
            : "border-black/10 dark:border-white/10 bg-bg-card"
        }`}
      >
        <div className="text-left">
          <p className="text-sm text-text-primary font-medium">Wieder kochen?</p>
          <p className="text-xs text-text-muted mt-0.5">
            {wouldRepeat ? "Ja, gerne!" : "Lieber nicht nochmal"}
          </p>
        </div>
        <span className="text-2xl ml-3">{wouldRepeat ? "💚" : "🙅"}</span>
      </button>

      {/* Buttons */}
      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={onSkip}
          className="flex-1 py-3.5 rounded-2xl border border-black/10 dark:border-white/10 text-text-muted text-sm font-medium"
        >
          Überspringen
        </button>
        <button
          disabled={rating === 0}
          onClick={() => rating > 0 && onSave(rating, wouldRepeat)}
          className={`flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-opacity ${
            rating > 0
              ? "bg-accent-gold text-ink opacity-100"
              : "bg-accent-gold/40 text-ink/60 opacity-60 cursor-not-allowed"
          }`}
        >
          Speichern
        </button>
      </div>
    </motion.div>
  );
}
