"use client";

import { motion } from "framer-motion";
import type { RecipeJSON, UserRole } from "@/types/database";

export function RecipeView({
  mealName,
  imageUrl,
  recipe,
  currentUser,
  onBack,
  onShare,
  onGoShopping,
}: {
  mealName: string;
  imageUrl: string | null;
  recipe: RecipeJSON;
  currentUser: UserRole;
  onBack: () => void;
  onShare: () => void;
  onGoShopping?: () => void;
}) {
  const nutrition = recipe.nutrition_per_person[currentUser];
  const otherNutrition = recipe.nutrition_per_person[currentUser === "adrian" ? "janina" : "adrian"];

  return (
    <div className="min-h-dvh bg-bg-primary pb-24 safe-bottom">
      {/* Hero image */}
      <div className="relative h-72">
        {imageUrl ? (
          <img src={imageUrl} alt={mealName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-bg-card to-bg-elevated flex items-center justify-center">
            <span className="text-8xl opacity-20">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 safe-top w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
        >
          <span className="text-white text-lg">←</span>
        </button>
      </div>

      {/* Content */}
      <div className="px-5 -mt-12 relative z-10">
        <h1 className="font-display text-2xl font-bold text-text-primary mb-4">
          {mealName}
        </h1>

        {/* Nutrition cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <NutritionCard
            label={currentUser === "adrian" ? "Adrian" : "Janina"}
            data={nutrition}
            highlight
          />
          <NutritionCard
            label={currentUser === "adrian" ? "Janina" : "Adrian"}
            data={otherNutrition}
          />
        </div>

        {/* Equipment */}
        {recipe.equipment.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm text-text-muted uppercase tracking-wider mb-2">Geräte</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.equipment.map((eq) => (
                <span key={eq} className="text-xs bg-bg-card px-3 py-1.5 rounded-full text-text-secondary">
                  {eq}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Spice note */}
        {recipe.spice_note && (
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-xl p-3 mb-6">
            <p className="text-sm text-text-secondary">🌶️ {recipe.spice_note}</p>
          </div>
        )}

        {/* Ingredients */}
        <h3 className="text-sm text-text-muted uppercase tracking-wider mb-3">Zutaten</h3>
        <div className="space-y-2 mb-8">
          {recipe.ingredients.map((ing) => {
            const amount = currentUser === "adrian" ? ing.amount_adrian : ing.amount_janina;
            return (
              <div
                key={ing.name}
                className="flex items-center gap-3 bg-bg-card rounded-xl p-3"
              >
                {ing.image_url ? (
                  <img
                    src={ing.image_url}
                    alt={ing.name}
                    className="w-10 h-10 rounded-full object-cover bg-bg-elevated"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-lg">
                    🥘
                  </div>
                )}
                <div className="flex-1">
                  <span className="text-sm text-text-primary">{ing.name}</span>
                  <span className="text-xs text-text-muted block">
                    {amount} {ing.unit}
                  </span>
                </div>
                <span className="text-[10px] text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
                  {ing.category}
                </span>
              </div>
            );
          })}
        </div>

        {/* Steps */}
        <h3 className="text-sm text-text-muted uppercase tracking-wider mb-3">Zubereitung</h3>
        <div className="space-y-4 mb-8">
          {recipe.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-3"
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-accent-gold/20 text-accent-gold text-sm font-semibold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed pt-0.5">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg-secondary/90 backdrop-blur-xl border-t border-black/5 dark:border-white/5 safe-bottom">
        <div className="flex items-center gap-3 h-16 px-5">
          {onGoShopping && (
            <button
              onClick={onGoShopping}
              className="flex-1 py-3 rounded-xl bg-accent-gold text-ink font-semibold text-sm flex items-center justify-center gap-2"
            >
              🛒 Einkaufsliste
            </button>
          )}
          <button
            onClick={onBack}
            className="flex-1 py-3 rounded-xl bg-bg-card border border-black/10 dark:border-white/10 text-text-primary font-medium text-sm"
          >
            Fertig
          </button>
          <button
            onClick={onShare}
            className="w-10 h-10 shrink-0 rounded-xl bg-bg-card border border-black/10 dark:border-white/10 flex items-center justify-center"
            aria-label="Teilen"
          >
            <span className="text-sm">↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function NutritionCard({
  label,
  data,
  highlight,
}: {
  label: string;
  data: { calories: number; protein: number; carbs: number; fat: number };
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        highlight ? "bg-accent-gold/10 border border-accent-gold/20" : "bg-bg-card"
      }`}
    >
      <p className={`text-xs mb-2 ${highlight ? "text-accent-gold" : "text-text-muted"}`}>
        {label}
      </p>
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <span className="text-text-primary font-medium">{data.calories} kcal</span>
        <span className="text-text-secondary">{data.protein}g Protein</span>
        <span className="text-text-secondary">{data.carbs}g Carbs</span>
        <span className="text-text-secondary">{data.fat}g Fett</span>
      </div>
    </div>
  );
}
