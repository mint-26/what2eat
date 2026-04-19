"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserRole } from "@/types/database";

export function RatingModal({
  mealName,
  currentUser,
  onSubmit,
  onClose,
}: {
  mealName: string;
  currentUser: UserRole;
  onSubmit: (rating: number, wouldRepeat: boolean) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [wouldRepeat, setWouldRepeat] = useState(true);

  function handleStarTap(star: number) {
    setRating(star);
    if (navigator.vibrate) navigator.vibrate(30);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-bg-secondary rounded-t-3xl p-6 safe-bottom"
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-text-muted/20 rounded-full mx-auto mb-6" />

        <h3 className="font-display text-xl font-semibold text-text-primary text-center mb-1">
          Wie war&apos;s?
        </h3>
        <p className="text-sm text-text-muted text-center mb-6">{mealName}</p>

        {/* Stars */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileTap={{ scale: 0.85 }}
              animate={rating >= star ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.2 }}
              onClick={() => handleStarTap(star)}
              className="text-3xl"
            >
              {rating >= star ? "⭐" : "☆"}
            </motion.button>
          ))}
        </div>

        {/* Would repeat toggle */}
        <button
          onClick={() => setWouldRepeat(!wouldRepeat)}
          className={`
            w-full flex items-center justify-between p-4 rounded-xl mb-6 transition-colors
            ${wouldRepeat ? "bg-accent-green/10 border border-accent-green/20" : "bg-bg-card border border-transparent"}
          `}
        >
          <span className="text-sm text-text-primary">Nochmal kochen?</span>
          <motion.div
            animate={{ backgroundColor: wouldRepeat ? "#6b9e5e" : "#333333" }}
            className="relative w-12 h-7 rounded-full"
          >
            <motion.div
              animate={{ x: wouldRepeat ? 22 : 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm"
            />
          </motion.div>
        </button>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={rating === 0}
          onClick={() => onSubmit(rating, wouldRepeat)}
          className={`
            w-full py-4 rounded-2xl font-semibold text-sm transition-opacity
            ${rating > 0 ? "bg-accent-gold text-ink" : "bg-bg-card text-text-muted opacity-50"}
          `}
        >
          Bewertung speichern
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
