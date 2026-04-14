"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProvider, useUser } from "@/lib/user-context";
import { ProfilePicker } from "@/components/ProfilePicker";
import { BottomNav } from "@/components/BottomNav";
import { MealCard } from "@/components/MealCard";
import { MatchResultScreen } from "@/components/MatchResult";
import { RecipeView } from "@/components/RecipeView";
import { HistoryTab } from "@/components/HistoryTab";
import { ShoppingTab } from "@/components/ShoppingTab";
import { RatingOverlay } from "@/components/RatingOverlay";
import { LogoFull } from "@/components/Logo";
import { shareRecipe } from "@/lib/share";
import { determineMatch, assignCook } from "@/lib/match";
import { selectDailyRecipes } from "@/data/recipes";
import { getRecipeImage } from "@/data/recipe-images";
import {
  getCookCounts,
  incrementCookCount,
  saveSelection,
  subscribeToPartnerSelection,
  getTodaysMatch,
  saveMatchResult,
  getMealHistory,
  saveRating,
  getShoppingList,
  buildShoppingList,
  saveShoppingList,
  getRecentMealHistory,
  type HistoryEntry,
} from "@/lib/db";
import type {
  DailySuggestion,
  MatchResult,
  UserRole,
  ShoppingItem,
} from "@/types/database";

// ────────────────────────────────────────────────────────────────────────────
// Pexels image fetch with localStorage cache
// ────────────────────────────────────────────────────────────────────────────

const IMG_CACHE_KEY = "what2eat_img_cache";

function getCachedImage(mealName: string): string | null {
  try {
    const raw = localStorage.getItem(IMG_CACHE_KEY);
    if (!raw) return null;
    const cache = JSON.parse(raw) as Record<string, string>;
    return cache[mealName] ?? null;
  } catch {
    return null;
  }
}

function setCachedImage(mealName: string, url: string) {
  try {
    const raw = localStorage.getItem(IMG_CACHE_KEY);
    const cache = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    cache[mealName] = url;
    localStorage.setItem(IMG_CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* ignore */
  }
}

async function fetchPexelsImage(query: string): Promise<string | null> {
  try {
    const res = await fetch("/api/recipe-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.imageUrl ?? null;
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// AppContent
// ────────────────────────────────────────────────────────────────────────────

function AppContent() {
  const { currentUser, setCurrentUser, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState<"heute" | "woche" | "einkauf" | "history">("heute");

  // Suggestions
  const [suggestions, setSuggestions] = useState<DailySuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Selection & match
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [partnerSelected, setPartnerSelected] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  // Views
  const [showRecipe, setShowRecipe] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [matchDismissed, setMatchDismissed] = useState(false);

  // Data
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [shoppingMealName, setShoppingMealName] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const today = new Date().toISOString().split("T")[0];

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  // Load history & shopping on mount
  useEffect(() => {
    if (!currentUser) return;
    setHistory(getMealHistory());
    const savedShopping = getShoppingList(today);
    if (savedShopping.length > 0) {
      setShoppingItems(savedShopping);
    }
    // Check if there's already a match today
    const todaysMatch = getTodaysMatch(today);
    if (todaysMatch) {
      setMatchResult(todaysMatch);
      if (!savedShopping.length && todaysMatch.matched_recipe_json) {
        const items = buildShoppingList(todaysMatch.matched_recipe_json);
        setShoppingItems(items);
        setShoppingMealName(todaysMatch.matched_meal_name);
        saveShoppingList(today, items);
      } else {
        setShoppingMealName(todaysMatch.matched_meal_name);
      }
    }
  }, [currentUser, today]);

  // ── Suggestions ──────────────────────────────────────────────────────────

  const generateSuggestions = useCallback(() => {
    if (!currentUser) return;
    setLoadingSuggestions(true);
    setError(null);

    try {
      const recentMeals = getRecentMealHistory(14).map((m) => m.meal_name);
      const picks = selectDailyRecipes(currentUser, recentMeals);

      const mapped: DailySuggestion[] = picks.map((s, i) => ({
        id: `${currentUser}-${today}-${i}`,
        weekly_plan_id: null,
        day_of_week: new Date().getDay() || 7,
        date: today,
        user_role: currentUser,
        suggestion_index: i + 1,
        meal_name: s.meal_name,
        meal_description: s.description,
        cuisine_type: s.cuisine_type,
        calories_adrian: s.calories_adrian,
        calories_janina: s.calories_janina,
        protein_grams: s.protein_grams,
        prep_time_minutes: s.prep_time_minutes,
        spice_level: currentUser === "adrian" ? s.spice_level_adrian : s.spice_level_janina,
        recipe_json: s.recipe,
        // Prefer cached Pexels image, fall back to curated Unsplash
        meal_image_url: getCachedImage(s.meal_name) ?? getRecipeImage(s),
        created_at: new Date().toISOString(),
      }));

      setSuggestions(mapped);

      // Fetch real Pexels images in parallel (only for those not yet cached)
      picks.forEach(async (recipe, i) => {
        if (getCachedImage(recipe.meal_name)) return;
        const url = await fetchPexelsImage(recipe.meal_name);
        if (!url) return;
        setCachedImage(recipe.meal_name, url);
        setSuggestions((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, meal_image_url: url } : p))
        );
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Laden");
    } finally {
      setLoadingSuggestions(false);
    }
  }, [currentUser, today]);

  // Load suggestions when user is set (and no match today yet)
  useEffect(() => {
    if (currentUser && suggestions.length === 0 && !getTodaysMatch(today)) {
      generateSuggestions();
    }
  }, [currentUser, generateSuggestions, suggestions.length, today]);

  // ── Partner subscription ─────────────────────────────────────────────────

  useEffect(() => {
    if (!currentUser || !selectedId) return;

    // Cancel any previous subscription
    unsubscribeRef.current?.();

    const partnerRole: UserRole = currentUser === "adrian" ? "janina" : "adrian";

    const unsub = subscribeToPartnerSelection(today, currentUser, (partnerData) => {
      setPartnerSelected(true);

      // Compute match
      const myChoice = suggestions.find((s) => s.id === selectedId);
      if (!myChoice) return;

      const partnerSuggestion: DailySuggestion = {
        id: `partner-${today}`,
        weekly_plan_id: null,
        day_of_week: new Date().getDay() || 7,
        date: today,
        user_role: partnerRole,
        suggestion_index: 0,
        meal_name: partnerData.meal_name,
        meal_description: null,
        cuisine_type: partnerData.cuisine_type,
        calories_adrian: partnerData.calories_adrian,
        calories_janina: partnerData.calories_janina,
        protein_grams: partnerData.protein_grams,
        prep_time_minutes: null,
        spice_level: partnerData.spice_level,
        recipe_json: partnerData.recipe_json,
        meal_image_url: partnerData.meal_image_url,
        created_at: new Date().toISOString(),
      };

      const { matchType, matchedMeal } = determineMatch(myChoice, partnerSuggestion);
      const counts = getCookCounts();
      const whoKooks = assignCook(counts.adrian, counts.janina, today);

      const match: MatchResult = {
        id: `match-${Date.now()}`,
        date: today,
        matched_meal_name: matchedMeal.meal_name,
        matched_recipe_json: matchedMeal.recipe_json!,
        matched_image_url: matchedMeal.meal_image_url,
        who_cooks: whoKooks,
        match_type: matchType,
        created_at: new Date().toISOString(),
      };

      setMatchResult(match);
      saveMatchResult(match);

      // Build shopping list
      if (match.matched_recipe_json) {
        const items = buildShoppingList(match.matched_recipe_json);
        setShoppingItems(items);
        setShoppingMealName(match.matched_meal_name);
        saveShoppingList(today, items);
      }
    });

    unsubscribeRef.current = unsub;
    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, selectedId, today]);

  // Cleanup on unmount
  useEffect(() => () => unsubscribeRef.current?.(), []);

  // ── Handlers ─────────────────────────────────────────────────────────────

  async function handleSelect(id: string) {
    if (selectedId) return; // already selected
    setSelectedId(id);
    if (navigator.vibrate) navigator.vibrate(50);

    const chosen = suggestions.find((s) => s.id === id);
    if (!chosen || !currentUser) return;

    await saveSelection(today, currentUser, {
      meal_name: chosen.meal_name,
      cuisine_type: chosen.cuisine_type,
      recipe_json: chosen.recipe_json,
      meal_image_url: chosen.meal_image_url,
      calories_adrian: chosen.calories_adrian,
      calories_janina: chosen.calories_janina,
      protein_grams: chosen.protein_grams,
      spice_level: chosen.spice_level,
    });
  }

  function handleBackFromRecipe() {
    setShowRecipe(false);
    // Show rating prompt if not yet rated today
    const existing = history.find((h) => h.date_cooked === today);
    const myRating =
      currentUser === "adrian"
        ? existing?.rating_adrian
        : existing?.rating_janina;

    if (!myRating && matchResult) {
      setShowRating(true);
    }
  }

  async function handleRatingSave(rating: number, wouldRepeat: boolean) {
    if (!matchResult || !currentUser) return;
    setShowRating(false);

    await saveRating(
      today,
      matchResult.matched_meal_name,
      currentUser,
      rating,
      wouldRepeat,
      matchResult.matched_image_url
    );

    // Increment cook count for whoever cooked
    await incrementCookCount(matchResult.who_cooks);

    // Refresh history and dismiss the match celebration (user is done for today)
    setHistory(getMealHistory());
    setMatchDismissed(true);
  }

  // ── Rendering ─────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-bg-primary">
        <LogoFull />
      </div>
    );
  }

  if (!currentUser) {
    return <ProfilePicker onSelect={setCurrentUser} />;
  }

  // Rating overlay (post-recipe)
  if (showRating && matchResult) {
    return (
      <AnimatePresence>
        <RatingOverlay
          mealName={matchResult.matched_meal_name}
          imageUrl={matchResult.matched_image_url}
          currentUser={currentUser}
          onSave={handleRatingSave}
          onSkip={() => setShowRating(false)}
        />
      </AnimatePresence>
    );
  }

  // Match result overlay (only before user has dismissed / rated)
  if (matchResult && !showRecipe && !matchDismissed) {
    return (
      <MatchResultScreen
        match={matchResult}
        onViewRecipe={() => setShowRecipe(true)}
      />
    );
  }

  // Recipe view
  if (showRecipe && matchResult) {
    return (
      <RecipeView
        mealName={matchResult.matched_meal_name}
        imageUrl={matchResult.matched_image_url}
        recipe={matchResult.matched_recipe_json}
        currentUser={currentUser}
        onBack={handleBackFromRecipe}
        onShare={() =>
          shareRecipe(
            matchResult.matched_meal_name,
            matchResult.matched_recipe_json,
            currentUser
          )
        }
      />
    );
  }

  const partnerName = currentUser === "adrian" ? "Janina" : "Adrian";

  return (
    <div className="min-h-dvh bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-bg-primary/90 backdrop-blur-xl safe-top">
        <div className="flex items-center justify-between px-5 h-14">
          <LogoFull />
          <button
            onClick={() => setCurrentUser(null)}
            className="w-9 h-9 rounded-full bg-bg-card flex items-center justify-center"
          >
            <span className="text-lg">
              {currentUser === "adrian" ? "👨‍🍳" : "👩‍🍳"}
            </span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="pb-20">
        {/* ── Heute tab ─────────────────────────────────────────────────── */}
        {activeTab === "heute" && matchResult && matchDismissed && (
          <div className="px-5 pt-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
              Heute
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bg-card rounded-2xl overflow-hidden"
            >
              {matchResult.matched_image_url && (
                <img
                  src={matchResult.matched_image_url}
                  alt=""
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <p className="text-xs text-accent-gold mb-1">
                  🍳 {matchResult.who_cooks === "adrian" ? "Adrian" : "Janina"} kocht
                </p>
                <h2 className="text-xl font-serif mb-3">
                  {matchResult.matched_meal_name}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowRecipe(true)}
                    className="flex-1 py-3 rounded-xl bg-accent-gold text-bg-primary font-semibold text-sm"
                  >
                    Rezept ansehen
                  </button>
                  <button
                    onClick={() => setActiveTab("einkauf")}
                    className="flex-1 py-3 rounded-xl bg-bg-elevated text-text-primary font-semibold text-sm"
                  >
                    Einkaufsliste
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === "heute" && !(matchResult && matchDismissed) && (
          <div className="px-5">
            {/* Partner status */}
            <div className="flex items-center gap-2 mb-4 py-2">
              <span className="text-sm">
                {partnerSelected ? (
                  <span className="text-accent-green">
                    {partnerName} hat gewählt ✓
                  </span>
                ) : selectedId ? (
                  <span className="flex items-center gap-2 text-text-muted">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-2 h-2 bg-accent-gold rounded-full block"
                    />
                    {partnerName} wählt noch...
                  </span>
                ) : (
                  <span className="text-text-muted">
                    Wähle dein Abendessen
                  </span>
                )}
              </span>
            </div>

            {/* Loading state */}
            {loadingSuggestions && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-2 border-accent-gold/20 border-t-accent-gold"
                />
                <p className="text-text-muted text-sm">
                  Generiere Vorschläge...
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-center py-20">
                <p className="text-accent-red mb-4">{error}</p>
                <button
                  onClick={generateSuggestions}
                  className="px-6 py-3 rounded-xl bg-accent-gold text-bg-primary font-semibold text-sm"
                >
                  Nochmal versuchen
                </button>
              </div>
            )}

            {/* Meal cards – horizontal scroll */}
            {suggestions.length > 0 && !loadingSuggestions && (
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 scrollbar-hide"
                style={{ WebkitOverflowScrolling: "touch" }}
              >
                {suggestions.map((s) => (
                  <MealCard
                    key={s.id}
                    suggestion={s}
                    currentUser={currentUser}
                    isSelected={selectedId === s.id}
                    onSelect={() => handleSelect(s.id)}
                  />
                ))}
              </div>
            )}

            {/* Selected confirmation */}
            {selectedId && !matchResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className="text-accent-gold text-sm">
                  Deine Wahl:{" "}
                  {suggestions.find((s) => s.id === selectedId)?.meal_name}
                </p>
                <p className="text-text-muted text-xs mt-1">
                  Warte auf {partnerName}...
                </p>
              </motion.div>
            )}

            {/* Empty state */}
            {!loadingSuggestions && !error && suggestions.length === 0 && (
              <div className="text-center py-20">
                <span className="text-6xl block mb-4">🍽️</span>
                <p className="text-text-secondary mb-2">Noch keine Vorschläge</p>
                <p className="text-text-muted text-sm mb-6">
                  Tippe auf den Button um loszulegen
                </p>
                <button
                  onClick={generateSuggestions}
                  className="px-6 py-3 rounded-xl bg-accent-gold text-bg-primary font-semibold text-sm"
                >
                  Vorschläge generieren
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Woche tab (shows history as week view) ──────────────────── */}
        {activeTab === "woche" && (
          <WeekTab history={history} currentUser={currentUser} />
        )}

        {/* ── Einkauf tab ───────────────────────────────────────────────── */}
        {activeTab === "einkauf" && (
          <ShoppingTab
            items={shoppingItems}
            date={today}
            mealName={shoppingMealName}
          />
        )}

        {/* ── History tab ───────────────────────────────────────────────── */}
        {activeTab === "history" && (
          <HistoryTab
            history={history}
            currentUser={currentUser}
            onRate={async (date, mealName, rating, wouldRepeat, imageUrl) => {
              await saveRating(date, mealName, currentUser, rating, wouldRepeat, imageUrl);
              setHistory(getMealHistory());
            }}
          />
        )}
      </main>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Week tab – 7-day calendar overview
// ────────────────────────────────────────────────────────────────────────────

function WeekTab({
  history,
  currentUser,
}: {
  history: HistoryEntry[];
  currentUser: UserRole;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const today = new Date().toISOString().split("T")[0];
  const historyMap = Object.fromEntries(history.map((h) => [h.date_cooked, h]));

  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

  return (
    <div className="px-5 pt-4 pb-6">
      <h2 className="text-xs text-text-muted uppercase tracking-wider mb-4">
        Die letzten 7 Tage
      </h2>

      <div className="space-y-2">
        {days.map((date) => {
          const entry = historyMap[date];
          const jsDate = new Date(date + "T12:00:00");
          const isToday = date === today;

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                isToday ? "bg-accent-gold/10 border border-accent-gold/20" : "bg-bg-card"
              }`}
            >
              {/* Day label */}
              <div className="w-10 text-center shrink-0">
                <p
                  className={`text-xs font-medium ${
                    isToday ? "text-accent-gold" : "text-text-muted"
                  }`}
                >
                  {dayNames[jsDate.getDay()]}
                </p>
                <p
                  className={`text-lg font-bold leading-none ${
                    isToday ? "text-accent-gold" : "text-text-secondary"
                  }`}
                >
                  {jsDate.getDate()}
                </p>
              </div>

              {/* Divider */}
              <div
                className={`w-px h-10 shrink-0 ${
                  isToday ? "bg-accent-gold/30" : "bg-white/10"
                }`}
              />

              {/* Meal or empty */}
              {entry ? (
                <>
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-bg-elevated flex items-center justify-center">
                    {entry.image_url ? (
                      <img
                        src={entry.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xl opacity-30">🍽️</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary truncate">
                      {entry.meal_name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {entry.who_cooked === currentUser ? "Du" : entry.who_cooked === "adrian" ? "Adrian" : "Janina"} hat gekocht
                      {(currentUser === "adrian"
                        ? entry.rating_adrian
                        : entry.rating_janina) && (
                        <span className="ml-1">
                          {"⭐".repeat(
                            (currentUser === "adrian"
                              ? entry.rating_adrian
                              : entry.rating_janina) ?? 0
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-text-muted text-sm flex-1">
                  {isToday ? "Noch kein Match heute" : "—"}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
