import type { DailySuggestion, UserRole, MatchType } from "@/types/database";

// Deterministic 0–1 pseudo-random from a string (so both devices agree).
// Uses FNV-1a for good distribution even on very similar inputs (e.g. dates
// that only differ in the last digit).
function seededRandom(seed: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619); // FNV prime
    hash |= 0;
  }
  return Math.abs(hash % 10000) / 10000;
}

export function determineMatch(
  adrianChoice: DailySuggestion,
  janinaChoice: DailySuggestion
): { matchType: MatchType; matchedMeal: DailySuggestion } {
  // Seed from date + both meal names — both devices compute identically.
  const seed = `${adrianChoice.date}-${adrianChoice.meal_name}-${janinaChoice.meal_name}`;
  const r = seededRandom(seed);

  // Exact match: same cuisine AND same meal name
  if (
    adrianChoice.cuisine_type === janinaChoice.cuisine_type &&
    adrianChoice.meal_name === janinaChoice.meal_name
  ) {
    return { matchType: "exact", matchedMeal: adrianChoice };
  }

  // Similar match: same cuisine type → deterministic pick
  if (adrianChoice.cuisine_type === janinaChoice.cuisine_type) {
    const pick = r > 0.5 ? adrianChoice : janinaChoice;
    return { matchType: "compromise", matchedMeal: pick };
  }

  // No match: deterministic pick
  const pick = r > 0.5 ? adrianChoice : janinaChoice;
  return { matchType: "random", matchedMeal: pick };
}

export function assignCook(
  adrianCookCount: number,
  janinaCookCount: number,
  date?: string
): UserRole {
  // Favor the person who has cooked less
  if (adrianCookCount < janinaCookCount) return "adrian";
  if (janinaCookCount < adrianCookCount) return "janina";
  // Equal: deterministic based on date so both devices agree
  if (date) {
    return seededRandom(date) > 0.5 ? "adrian" : "janina";
  }
  return Math.random() > 0.5 ? "adrian" : "janina";
}
