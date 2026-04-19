"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MatchResult as MatchResultType } from "@/types/database";

function Confetti() {
  const colors = ["#c74b3f", "#d4a843", "#6b9e5e", "#c47a5a", "#e8c05a"];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: colors[i % colors.length],
    rotation: Math.random() * 360,
    size: 4 + Math.random() * 6,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: "easeIn" }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

function CoinFlip({ whoKooks, onDone }: { whoKooks: string; onDone: () => void }) {
  const [phase, setPhase] = useState<"spinning" | "result">("spinning");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase("result");
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      setTimeout(onDone, 1500);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-text-muted text-sm uppercase tracking-widest">Wer kocht?</p>
      <AnimatePresence mode="wait">
        {phase === "spinning" ? (
          <motion.div
            key="spin"
            animate={{ rotateY: [0, 1800] }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-gold to-accent-red flex items-center justify-center"
          >
            <span className="text-4xl">🪙</span>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-5xl">{whoKooks === "adrian" ? "👨‍🍳" : "👩‍🍳"}</span>
            <span className="font-display text-2xl font-bold text-accent-gold">
              {whoKooks === "adrian" ? "Adrian" : "Janina"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MatchResultScreen({
  match,
  onViewRecipe,
  onGoShopping,
  onDismiss,
}: {
  match: MatchResultType;
  onViewRecipe: () => void;
  onGoShopping: () => void;
  onDismiss: () => void;
}) {
  const [showCook, setShowCook] = useState(false);
  const [cookRevealed, setCookRevealed] = useState(false);

  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    const t = setTimeout(() => setShowCook(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 bg-bg-primary/95 backdrop-blur-lg flex flex-col items-center justify-center px-6 safe-top safe-bottom"
    >
      <Confetti />

      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-accent-gold text-sm uppercase tracking-[0.3em] mb-4"
      >
        Euer Match heute
      </motion.p>

      {/* Meal Image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-56 h-56 rounded-3xl overflow-hidden mb-6 shadow-2xl shadow-accent-gold/20"
      >
        {match.matched_image_url ? (
          <img
            src={match.matched_image_url}
            alt={match.matched_meal_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bg-card to-bg-elevated flex items-center justify-center">
            <span className="text-7xl">🍽️</span>
          </div>
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-display text-2xl font-bold text-center text-text-primary mb-8"
      >
        {match.matched_meal_name}
      </motion.h2>

      {/* Cook assignment */}
      {showCook && !cookRevealed && (
        <CoinFlip whoKooks={match.who_cooks} onDone={() => setCookRevealed(true)} />
      )}

      {cookRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 mb-8"
        >
          <p className="text-text-muted text-sm">Heute kocht</p>
          <p className="font-display text-xl font-bold text-accent-gold">
            {match.who_cooks === "adrian" ? "Adrian 👨‍🍳" : "Janina 👩‍🍳"}
          </p>
        </motion.div>
      )}

      {/* CTAs */}
      {cookRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xs space-y-3"
        >
          <button
            onClick={onViewRecipe}
            className="w-full py-4 rounded-2xl bg-accent-gold text-bg-primary font-semibold text-base"
          >
            Rezept ansehen
          </button>
          <button
            onClick={onGoShopping}
            className="w-full py-3.5 rounded-2xl bg-bg-card border border-white/10 text-text-primary font-medium text-sm flex items-center justify-center gap-2"
          >
            <span>🛒</span> Einkaufsliste
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-2 text-sm text-text-muted"
          >
            Weiter →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
