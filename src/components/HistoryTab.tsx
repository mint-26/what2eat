"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UserRole } from "@/types/database";
import type { HistoryEntry } from "@/lib/db";

function StarRating({
  value,
  onChange,
  readonly,
}: {
  value: number | null;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange?.(star)}
          disabled={readonly}
          className={`text-xl transition-opacity ${
            readonly ? "cursor-default" : "cursor-pointer active:scale-110"
          } ${value && star <= value ? "opacity-100" : "opacity-25"}`}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}

function HistoryCard({
  entry,
  currentUser,
  onRate,
}: {
  entry: HistoryEntry;
  currentUser: UserRole;
  onRate: (entry: HistoryEntry) => void;
}) {
  const myRating =
    currentUser === "adrian" ? entry.rating_adrian : entry.rating_janina;
  const partnerRating =
    currentUser === "adrian" ? entry.rating_janina : entry.rating_adrian;
  const partnerName = currentUser === "adrian" ? "Janina" : "Adrian";

  const dateLabel = new Date(entry.date_cooked + "T12:00:00").toLocaleDateString(
    "de-DE",
    { weekday: "short", day: "numeric", month: "short" }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl overflow-hidden"
    >
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-bg-elevated flex items-center justify-center">
          {entry.image_url ? (
            <img
              src={entry.image_url}
              alt={entry.meal_name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl opacity-30">🍽️</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-sm font-medium truncate">
            {entry.meal_name}
          </p>
          <p className="text-text-muted text-xs mt-0.5">{dateLabel}</p>
          {entry.who_cooked && (
            <p className="text-text-muted text-xs mt-0.5">
              Gekocht von{" "}
              <span className="text-text-secondary">
                {entry.who_cooked === "adrian" ? "Adrian 👨‍🍳" : "Janina 👩‍🍳"}
              </span>
            </p>
          )}

          {/* Ratings row */}
          <div className="flex items-center gap-2 mt-2">
            {myRating ? (
              <StarRating value={myRating} readonly />
            ) : (
              <button
                onClick={() => onRate(entry)}
                className="text-xs text-accent-gold border border-accent-gold/30 px-2 py-0.5 rounded-full"
              >
                Bewerten
              </button>
            )}
            {partnerRating && (
              <span className="text-xs text-text-muted">
                {partnerName}: {partnerRating}★
              </span>
            )}
          </div>
        </div>

        {/* Would repeat badge */}
        {!entry.would_repeat && (
          <span className="shrink-0 text-xs text-accent-red/70 self-start">
            Nicht wiederholen
          </span>
        )}
      </div>
    </motion.div>
  );
}

interface RatingModalProps {
  entry: HistoryEntry;
  currentUser: UserRole;
  onSave: (rating: number, wouldRepeat: boolean) => void;
  onClose: () => void;
}

function RatingModal({ entry, currentUser, onSave, onClose }: RatingModalProps) {
  const [rating, setRating] = useState<number>(3);
  const [wouldRepeat, setWouldRepeat] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm px-4 pb-8"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-bg-elevated rounded-3xl p-6"
      >
        <h3 className="font-display text-lg font-bold text-text-primary text-center mb-1">
          {entry.meal_name}
        </h3>
        <p className="text-text-muted text-xs text-center mb-6">
          Wie hat es geschmeckt?
        </p>

        <div className="flex justify-center mb-6">
          <StarRating value={rating} onChange={setRating} />
        </div>

        <button
          onClick={() => setWouldRepeat(!wouldRepeat)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border mb-6 transition-colors ${
            wouldRepeat
              ? "border-accent-green/40 bg-accent-green/10"
              : "border-black/10 dark:border-white/10 bg-bg-card"
          }`}
        >
          <span className="text-sm text-text-primary">Würde ich wiederholen</span>
          <span className="text-lg">{wouldRepeat ? "✅" : "⬜"}</span>
        </button>

        <button
          onClick={() => onSave(rating, wouldRepeat)}
          className="w-full py-3.5 rounded-2xl bg-accent-gold text-ink font-semibold text-sm"
        >
          Bewertung speichern
        </button>
      </motion.div>
    </motion.div>
  );
}

export function HistoryTab({
  history,
  currentUser,
  onRate,
}: {
  history: HistoryEntry[];
  currentUser: UserRole;
  onRate: (date: string, mealName: string, rating: number, wouldRepeat: boolean, imageUrl?: string | null) => void;
}) {
  const [ratingEntry, setRatingEntry] = useState<HistoryEntry | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
        <span className="text-5xl mb-4 block">📖</span>
        <p className="text-text-secondary mb-1">Noch keine Geschichte</p>
        <p className="text-text-muted text-sm">
          Eure gemeinsamen Mahlzeiten erscheinen hier
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 pb-6">
      <h2 className="text-xs text-text-muted uppercase tracking-wider mb-4">
        {history.length} gemeinsame Mahlzeiten
      </h2>

      <div className="space-y-3">
        {history.map((entry) => (
          <HistoryCard
            key={entry.id}
            entry={entry}
            currentUser={currentUser}
            onRate={setRatingEntry}
          />
        ))}
      </div>

      <AnimatePresence>
        {ratingEntry && (
          <RatingModal
            entry={ratingEntry}
            currentUser={currentUser}
            onSave={(rating, wouldRepeat) => {
              onRate(ratingEntry.date_cooked, ratingEntry.meal_name, rating, wouldRepeat, ratingEntry.image_url);
              setRatingEntry(null);
            }}
            onClose={() => setRatingEntry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
