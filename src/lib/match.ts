import type { DailySuggestion, UserRole, MatchType } from "@/types/database";

export function determineMatch(
  adrianChoice: DailySuggestion,
  janinaChoice: DailySuggestion
): { matchType: MatchType; matchedMeal: DailySuggestion } {
  // Exact match: same cuisine AND similar meal name
  if (
    adrianChoice.cuisine_type === janinaChoice.cuisine_type &&
    adrianChoice.meal_name === janinaChoice.meal_name
  ) {
    return { matchType: "exact", matchedMeal: adrianChoice };
  }

  // Similar match: same cuisine type → pick one randomly
  if (adrianChoice.cuisine_type === janinaChoice.cuisine_type) {
    const pick = Math.random() > 0.5 ? adrianChoice : janinaChoice;
    return { matchType: "compromise", matchedMeal: pick };
  }

  // No match: random pick from either
  const pick = Math.random() > 0.5 ? adrianChoice : janinaChoice;
  return { matchType: "random", matchedMeal: pick };
}

export function assignCook(
  adrianCookCount: number,
  janinaCookCount: number
): UserRole {
  // Favor the person who has cooked less
  if (adrianCookCount < janinaCookCount) return "adrian";
  if (janinaCookCount < adrianCookCount) return "janina";
  // Equal: random
  return Math.random() > 0.5 ? "adrian" : "janina";
}
