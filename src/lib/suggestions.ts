import type { UserRole, MealHistory } from "@/types/database";

const PROFILES = {
  adrian: {
    name: "Adrian",
    age: 44,
    height: "185cm",
    weight: "90kg",
    goal: "Kaloriendefizit, Muskelaufbau",
    calories: "500-700 kcal",
    spice: "Pikant/scharf (Stufe 3-4 von 5)",
    exclusions: "Kein Schweinefleisch, keine Salami, keine Innereien, keine Blutwurst, keine Haselnüsse",
    lactose: "Laktoseintoleranz",
  },
  janina: {
    name: "Janina",
    age: 42,
    height: "181cm",
    weight: "70kg",
    goal: "Kaloriendefizit, Muskelaufbau",
    calories: "400-550 kcal",
    spice: "Mild (Stufe 1-2 von 5)",
    exclusions: "Kein Schweinefleisch, keine Salami, keine Innereien, keine Blutwurst, keine Haselnüsse",
    lactose: "Bevorzugt laktosefreie Produkte",
  },
} as const;

export function buildSuggestionPrompt(
  role: UserRole,
  recentMeals: MealHistory[],
  partnerSuggestionHints?: string[]
) {
  const profile = PROFILES[role];
  const recentList = recentMeals.length
    ? recentMeals.map((m) => `- ${m.meal_name} (${m.date_cooked}, Bewertung: ${m.rating_adrian ?? m.rating_janina ?? "?"})`).join("\n")
    : "Keine bisherigen Gerichte.";

  const partnerHint = partnerSuggestionHints?.length
    ? `\nWICHTIG FÜR MATCH: Mindestens 1 der 3 Vorschläge sollte thematisch ähnlich zu einem dieser Gerichte sein (personalisiert für ${profile.name}): ${partnerSuggestionHints.join(", ")}`
    : "";

  return `Du bist ein Ernährungsexperte und Koch der Abendessen für ein sportliches Paar plant.

PERSON: ${profile.name}
- ${profile.age} Jahre, ${profile.height}, ${profile.weight}, sehr sportlich
- Ziel: ${profile.goal}
- Abendessen-Kalorien: ${profile.calories}
- ${profile.lactose}
- Schärfe: ${profile.spice}
- Ausschlüsse: ${profile.exclusions}

REGELN:
- Mindestens 40g Protein pro Portion
- Kalorienrahmen strikt einhalten
- Keine verbotenen Zutaten
- Laktosefreie Alternativen (Skyr ist OK)
- Zubereitungszeit: 10-45 Minuten
- Geräte: Herd, Ofen, Airfryer, Mikrowelle, Grill
- Nicht das gleiche Protein oder die gleiche Küche an 2 aufeinanderfolgenden Tagen
- Schärfe personalisieren
- Alle Küchen willkommen — sei kreativ und abwechslungsreich
- Nicht 3x das gleiche Protein

GEKOCHT (letzte 14 Tage):
${recentList}
${partnerHint}

Generiere 3 Vorschläge als JSON. Antworte NUR mit dem JSON, kein anderer Text:
{
  "suggestions": [
    {
      "meal_name": "Kreativer appetitlicher Name",
      "description": "1-2 Sätze die Hunger machen",
      "cuisine_type": "z.B. Asiatisch, Mediterran, Mexikanisch",
      "calories": {"adrian": X, "janina": X},
      "protein_grams": X,
      "prep_time_minutes": X,
      "spice_level": X,
      "main_ingredients": ["max 5 Hauptzutaten"],
      "recipe": {
        "ingredients": [
          {"name": "Zutat", "amount_adrian": "200", "amount_janina": "150", "unit": "g", "category": "Fleisch/Fisch|Gemüse|Milchprodukte|Gewürze|Getreide/Hülsenfrüchte|Sonstiges"}
        ],
        "steps": ["Schritt 1...", "Schritt 2..."],
        "equipment": ["Herd", "Pfanne"],
        "spice_note": "Adrian: 1 TL Chiliflocken. Janina: weglassen.",
        "nutrition_per_person": {
          "adrian": {"calories": X, "protein": X, "carbs": X, "fat": X},
          "janina": {"calories": X, "protein": X, "carbs": X, "fat": X}
        }
      }
    }
  ]
}`;
}

export function buildImagePrompt(mealName: string, mainIngredients: string[]) {
  return `Professional food photography of ${mealName}, with ${mainIngredients.join(", ")}, beautifully plated on a ceramic plate, warm natural lighting, top-down angle, shallow depth of field, appetizing, editorial food magazine style, dark moody background`;
}
