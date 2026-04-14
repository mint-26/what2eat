"use client";

/**
 * Local-first persistence layer.
 * All data is stored in localStorage. When Supabase is configured,
 * data is also synced to the cloud enabling real-time multi-device sync.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type { MatchResult, MealHistory, UserRole, RecipeJSON, ShoppingItem } from "@/types/database";
import { roundToPackage, recommendStore, LOCATIONS, type LocationKey } from "./packaging";

// ────────────────────────────────────────────────────────────────────────────
// Keys
// ────────────────────────────────────────────────────────────────────────────

const LS = {
  cookCounts: "w2e_cook_counts",
  history: "w2e_history",
  selection: (date: string, role: UserRole) => `w2e_sel_${date}_${role}`,
  match: (date: string) => `w2e_match_${date}`,
  shopping: (date: string) => `w2e_shop_${date}`,
};

function ls<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function lsSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ────────────────────────────────────────────────────────────────────────────
// Cook counts
// ────────────────────────────────────────────────────────────────────────────

export interface CookCounts {
  adrian: number;
  janina: number;
}

export function getCookCounts(): CookCounts {
  return ls<CookCounts>(LS.cookCounts) ?? { adrian: 0, janina: 0 };
}

export async function incrementCookCount(role: UserRole) {
  const counts = getCookCounts();
  counts[role] += 1;
  lsSet(LS.cookCounts, counts);

  if (isSupabaseConfigured && supabase) {
    await supabase
      .from("profiles")
      .update({ cook_count: counts[role] } as never)
      .eq("role", role);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Selection (today's meal choice per user)
// ────────────────────────────────────────────────────────────────────────────

export interface SelectionData {
  meal_name: string;
  cuisine_type: string | null;
  recipe_json: RecipeJSON | null;
  meal_image_url: string | null;
  calories_adrian: number | null;
  calories_janina: number | null;
  protein_grams: number | null;
  spice_level: number | null;
}

export function getLocalSelection(date: string, role: UserRole): SelectionData | null {
  return ls<SelectionData>(LS.selection(date, role));
}

export async function saveSelection(date: string, role: UserRole, data: SelectionData) {
  lsSet(LS.selection(date, role), data);

  if (isSupabaseConfigured && supabase) {
    // Upsert into user_selections; conflict on (date, user_role) unique constraint.
    const { error } = await supabase
      .from("user_selections" as never)
      .upsert(
        {
          date,
          user_role: role,
          meal_name: data.meal_name,
          cuisine_type: data.cuisine_type,
          recipe_json: data.recipe_json,
          meal_image_url: data.meal_image_url,
        } as never,
        { onConflict: "date,user_role" } as never
      );
    if (error) {
      console.error("[saveSelection] Supabase error:", error);
    }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Real-time partner selection subscription
// ────────────────────────────────────────────────────────────────────────────

export function subscribeToPartnerSelection(
  date: string,
  myRole: UserRole,
  onPartnerSelected: (data: SelectionData) => void
): (() => void) {
  const partnerRole: UserRole = myRole === "adrian" ? "janina" : "adrian";
  let stopped = false;
  let fired = false;

  const fire = (data: SelectionData) => {
    if (fired || stopped) return;
    fired = true;
    onPartnerSelected(data);
  };

  // Same-device fallback: localStorage polling (works for testing on one device)
  const localInterval = setInterval(() => {
    if (stopped || fired) return;
    const sel = getLocalSelection(date, partnerRole);
    if (sel) fire(sel);
  }, 1000);

  // Cross-device: poll Supabase every 2 seconds (more reliable than Realtime
  // since Realtime requires the what2eat schema to be in supabase_realtime
  // publication, which is often misconfigured)
  let remoteInterval: ReturnType<typeof setInterval> | null = null;
  if (isSupabaseConfigured && supabase) {
    const poll = async () => {
      if (stopped || fired || !supabase) return;
      try {
        const { data, error } = await supabase
          .from("user_selections" as never)
          .select("meal_name, cuisine_type, recipe_json, meal_image_url")
          .eq("date", date)
          .eq("user_role", partnerRole)
          .maybeSingle();
        if (error) return;
        if (data) {
          const row = data as {
            meal_name: string;
            cuisine_type: string | null;
            recipe_json: RecipeJSON | null;
            meal_image_url: string | null;
          };
          fire({
            meal_name: row.meal_name,
            cuisine_type: row.cuisine_type,
            recipe_json: row.recipe_json,
            meal_image_url: row.meal_image_url,
            calories_adrian: null,
            calories_janina: null,
            protein_grams: null,
            spice_level: null,
          });
        }
      } catch {
        /* ignore network errors */
      }
    };
    poll(); // immediate check
    remoteInterval = setInterval(poll, 2000);
  }

  return () => {
    stopped = true;
    clearInterval(localInterval);
    if (remoteInterval) clearInterval(remoteInterval);
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Match results
// ────────────────────────────────────────────────────────────────────────────

export function getTodaysMatch(date: string): MatchResult | null {
  return ls<MatchResult>(LS.match(date));
}

/** Poll Supabase for today's match (used during mismatch negotiation on the other device). */
export async function fetchRemoteMatch(date: string): Promise<MatchResult | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("match_results")
      .select("id, date, matched_meal_name, matched_recipe_json, matched_image_url, who_cooks, match_type, created_at")
      .eq("date", date)
      .maybeSingle();
    if (error || !data) return null;
    const m = data as Partial<MatchResult>;
    // Validieren: ohne recipe_json wäre das Match ungültig (buildShoppingList würde crashen)
    if (!m.matched_meal_name || !m.matched_recipe_json || !m.who_cooks) return null;
    const valid = m as MatchResult;
    lsSet(LS.match(date), valid);
    return valid;
  } catch {
    return null;
  }
}

export async function saveMatchResult(match: MatchResult) {
  lsSet(LS.match(match.date), match);

  // Also add to history
  const existing = ls<MatchResult[]>("w2e_matches") ?? [];
  const withoutToday = existing.filter((m) => m.date !== match.date);
  lsSet("w2e_matches", [match, ...withoutToday].slice(0, 90)); // keep 90 days

  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from("match_results").upsert(
      {
        date: match.date,
        matched_meal_name: match.matched_meal_name,
        matched_recipe_json: match.matched_recipe_json as never,
        matched_image_url: match.matched_image_url,
        who_cooks: match.who_cooks,
        match_type: match.match_type,
      } as never,
      { onConflict: "date" } as never
    );
    if (error) console.error("[saveMatchResult] Supabase error:", error);
  }
}

export function getAllMatches(): MatchResult[] {
  return ls<MatchResult[]>("w2e_matches") ?? [];
}

/** Dev-Helper: löscht den heutigen State lokal + auf Supabase, damit neu getestet werden kann. */
export async function resetToday(date: string) {
  if (typeof window === "undefined") return;
  // Lokal
  localStorage.removeItem(LS.match(date));
  localStorage.removeItem(LS.selection(date, "adrian"));
  localStorage.removeItem(LS.selection(date, "janina"));
  localStorage.removeItem(LS.shopping(date));
  // Aus History entfernen
  const matches = ls<MatchResult[]>("w2e_matches") ?? [];
  lsSet("w2e_matches", matches.filter((m) => m.date !== date));
  const ratings = ls<Record<string, unknown>>("w2e_ratings") ?? {};
  delete ratings[date];
  lsSet("w2e_ratings", ratings);

  // Supabase
  if (isSupabaseConfigured && supabase) {
    await Promise.all([
      supabase.from("match_results").delete().eq("date", date),
      supabase.from("user_selections" as never).delete().eq("date", date),
      supabase.from("meal_history").delete().eq("date_cooked", date),
      supabase.from("shopping_lists" as never).delete().eq("date", date),
    ]);
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Meal history & ratings
// ────────────────────────────────────────────────────────────────────────────

export interface HistoryEntry extends MealHistory {
  who_cooked?: UserRole;
  match_type?: string;
}

export function getMealHistory(): HistoryEntry[] {
  const matches = getAllMatches();
  const ratings = ls<Record<string, { rating_adrian: number | null; rating_janina: number | null; would_repeat: boolean }>>( "w2e_ratings") ?? {};

  return matches.map((m) => ({
    id: m.id,
    meal_name: m.matched_meal_name,
    date_cooked: m.date,
    image_url: m.matched_image_url,
    would_repeat: ratings[m.date]?.would_repeat ?? true,
    rating_adrian: ratings[m.date]?.rating_adrian ?? null,
    rating_janina: ratings[m.date]?.rating_janina ?? null,
    who_cooked: m.who_cooks,
    match_type: m.match_type,
  }));
}

export async function saveRating(
  date: string,
  mealName: string,
  role: UserRole,
  rating: number,
  wouldRepeat: boolean,
  imageUrl?: string | null
) {
  const ratings = ls<Record<string, { rating_adrian: number | null; rating_janina: number | null; would_repeat: boolean }>>("w2e_ratings") ?? {};

  ratings[date] = {
    ...ratings[date],
    rating_adrian: role === "adrian" ? rating : (ratings[date]?.rating_adrian ?? null),
    rating_janina: role === "janina" ? rating : (ratings[date]?.rating_janina ?? null),
    would_repeat: wouldRepeat,
  };
  lsSet("w2e_ratings", ratings);

  if (isSupabaseConfigured && supabase) {
    const updateField = role === "adrian" ? "rating_adrian" : "rating_janina";
    await supabase
      .from("meal_history")
      .upsert(
        {
          meal_name: mealName,
          date_cooked: date,
          [updateField]: rating,
          would_repeat: wouldRepeat,
          image_url: imageUrl ?? null,
        } as never,
        { onConflict: "date_cooked" } as never
      );
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Shopping list
// ────────────────────────────────────────────────────────────────────────────

export function getShoppingList(date: string): ShoppingItem[] {
  return ls<ShoppingItem[]>(LS.shopping(date)) ?? [];
}

export function saveShoppingList(date: string, items: ShoppingItem[]) {
  lsSet(LS.shopping(date), items);
  void syncShoppingListRemote(date, items);
}

async function syncShoppingListRemote(date: string, items: ShoppingItem[]) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase
    .from("shopping_lists" as never)
    .upsert(
      { date, items, updated_at: new Date().toISOString() } as never,
      { onConflict: "date" } as never
    );
  if (error) console.error("[syncShoppingListRemote]", error);
}

export async function fetchRemoteShoppingList(date: string): Promise<ShoppingItem[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("shopping_lists" as never)
      .select("items")
      .eq("date", date)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as { items: ShoppingItem[] };
    return Array.isArray(row.items) ? row.items : null;
  } catch {
    return null;
  }
}

export function buildShoppingList(recipe: RecipeJSON, location?: LocationKey | null): ShoppingItem[] {
  const available = location ? LOCATIONS[location].stores : null;

  return recipe.ingredients.map((ing) => {
    const amtA = ing.amount_adrian ? `A: ${ing.amount_adrian}${ing.unit}` : "";
    const amtJ = ing.amount_janina ? `J: ${ing.amount_janina}${ing.unit}` : "";
    const combined = [amtA, amtJ].filter(Boolean).join(" / ");

    const pack = roundToPackage(ing);
    const store = available ? recommendStore(ing.name, ing.category, available) : null;

    return {
      name: ing.name,
      amount: combined,
      unit: ing.unit,
      category: ing.category,
      checked: false,
      package_size: pack.display,
      package_note: pack.packageSize,
      store,
    };
  });
}

// ────────────────────────────────────────────────────────────────────────────
// Recent meal names for prompt personalization
// ────────────────────────────────────────────────────────────────────────────

export function getRecentMealHistory(days = 14): MealHistory[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  return getMealHistory()
    .filter((h) => h.date_cooked >= cutoffStr)
    .map((h) => ({
      id: h.id,
      meal_name: h.meal_name,
      date_cooked: h.date_cooked,
      rating_adrian: h.rating_adrian,
      rating_janina: h.rating_janina,
      would_repeat: h.would_repeat,
      image_url: h.image_url,
    }));
}
