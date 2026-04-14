/**
 * Packaging & store recommendation logic.
 *
 * Rundet benötigte Mengen auf typische Handelsgrößen auf und empfiehlt
 * basierend auf Standort und Kategorie den passenden Supermarkt.
 */

import type { Ingredient } from "@/types/database";

export type Store = "Aldi" | "Lidl" | "Rewe" | "Edeka";

export type LocationKey = "bad_soden" | "muenzenberg";

export interface LocationInfo {
  key: LocationKey;
  label: string;
  stores: Store[];
}

export const LOCATIONS: Record<LocationKey, LocationInfo> = {
  bad_soden: {
    key: "bad_soden",
    label: "Bad Soden am Taunus",
    stores: ["Aldi", "Rewe", "Lidl"],
  },
  muenzenberg: {
    key: "muenzenberg",
    label: "Münzenberg",
    stores: ["Aldi", "Rewe", "Edeka"],
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Amount parsing
// ────────────────────────────────────────────────────────────────────────────

/** Parse "200", "200g", "1,5", "1/2", "2 TL" → number in given unit. */
function parseNumber(raw: string | null | undefined): number {
  if (!raw) return 0;
  const s = String(raw).trim().replace(",", ".");
  // fraction "1/2"
  const frac = s.match(/^(\d+)\s*\/\s*(\d+)/);
  if (frac) return parseInt(frac[1], 10) / parseInt(frac[2], 10);
  const num = s.match(/-?\d+(\.\d+)?/);
  return num ? parseFloat(num[0]) : 0;
}

/** Convert to base unit (g for mass, ml for volume, else piece). */
function toBaseAmount(value: number, unit: string): { amount: number; base: "g" | "ml" | "stk" } {
  const u = unit.toLowerCase().trim();
  if (u === "kg") return { amount: value * 1000, base: "g" };
  if (u === "g") return { amount: value, base: "g" };
  if (u === "l") return { amount: value * 1000, base: "ml" };
  if (u === "ml") return { amount: value, base: "ml" };
  // Stück, Zehe, TL, EL, Bund, Prise, etc. — keep as pieces
  return { amount: value, base: "stk" };
}

// ────────────────────────────────────────────────────────────────────────────
// Package sizes — typische Handels-Abnahmen (DE)
// ────────────────────────────────────────────────────────────────────────────

interface PackRule {
  match: RegExp;
  sizes: number[]; // in base unit (g/ml/stk)
  base: "g" | "ml" | "stk";
  unit?: string; // label override
}

const PACK_RULES: PackRule[] = [
  // Fleisch
  { match: /hackfleisch|hack\b|mett/i, sizes: [250, 400, 500, 1000], base: "g" },
  { match: /hähnchenbrust|hühnerbrust|chicken breast|geflügelbrust/i, sizes: [300, 400, 500, 600, 800, 1000], base: "g" },
  { match: /hähnchenschenkel|chicken thigh|hähnchenkeule/i, sizes: [500, 800, 1000], base: "g" },
  { match: /putenbrust|putenschnitzel/i, sizes: [300, 400, 500, 800], base: "g" },
  { match: /rindfleisch|rinderfilet|rumpsteak|entrecôte|steak\b/i, sizes: [200, 300, 400, 500, 600], base: "g" },
  { match: /schweinefilet|schweinelende/i, sizes: [400, 500, 800], base: "g" },
  { match: /schweineschnitzel|schnitzel/i, sizes: [300, 400, 500], base: "g" },
  { match: /lammfleisch|lammkotelett|lamm\b/i, sizes: [300, 400, 500], base: "g" },
  { match: /bacon|speck|schinkenspeck|pancetta/i, sizes: [100, 150, 200], base: "g" },
  { match: /salami|chorizo/i, sizes: [100, 150, 200], base: "g" },
  { match: /wurst|bratwurst|merguez/i, sizes: [200, 300, 400], base: "g" },

  // Fisch
  { match: /lachs|lachsfilet|salmon/i, sizes: [125, 200, 250, 400, 500], base: "g" },
  { match: /thunfisch.*dose|tuna.*can/i, sizes: [150, 185], base: "g", unit: "Dose" },
  { match: /thunfisch|tuna/i, sizes: [200, 300, 400], base: "g" },
  { match: /garnelen|shrimps|prawns/i, sizes: [150, 200, 250, 400], base: "g" },
  { match: /kabeljau|dorsch|cod|seelachs/i, sizes: [200, 300, 400], base: "g" },

  // Milchprodukte
  { match: /butter\b/i, sizes: [250], base: "g", unit: "Stück" },
  { match: /sahne|schlagsahne|crème fraîche|creme fraiche/i, sizes: [200], base: "ml", unit: "Becher" },
  { match: /frischkäse/i, sizes: [150, 200, 300], base: "g" },
  { match: /mozzarella/i, sizes: [125, 250], base: "g", unit: "Kugel" },
  { match: /parmesan|parmigiano|pecorino/i, sizes: [100, 150, 200], base: "g" },
  { match: /feta/i, sizes: [150, 200, 400], base: "g" },
  { match: /käse|cheddar|gouda|mozarella/i, sizes: [100, 150, 200, 400], base: "g" },
  { match: /joghurt|yogurt/i, sizes: [150, 250, 500, 1000], base: "g", unit: "Becher" },
  { match: /quark/i, sizes: [250, 500], base: "g" },
  { match: /milch|vollmilch/i, sizes: [1000], base: "ml", unit: "Liter" },

  // Grundnahrungsmittel
  { match: /reis|basmati|jasmin|risotto/i, sizes: [500, 1000], base: "g" },
  { match: /nudeln|pasta|spaghetti|penne|fusilli|tagliatelle|linguine/i, sizes: [500], base: "g", unit: "Packung" },
  { match: /mehl|weizenmehl|dinkelmehl/i, sizes: [1000], base: "g", unit: "Packung" },
  { match: /zucker/i, sizes: [1000], base: "g", unit: "Packung" },
  { match: /linsen|kichererbsen|bohnen|kidneybohnen/i, sizes: [250, 400, 500], base: "g" },
  { match: /haferflocken|müsli/i, sizes: [500, 1000], base: "g" },
  { match: /couscous|bulgur|quinoa/i, sizes: [250, 500], base: "g" },

  // Gemüse
  { match: /kartoffel/i, sizes: [1000, 1500, 2500], base: "g", unit: "Beutel" },
  { match: /zwiebel\b|zwiebeln/i, sizes: [500, 1000], base: "g", unit: "Netz" },
  { match: /knoblauch(?!.*pulver)/i, sizes: [1], base: "stk", unit: "Knolle" },
  { match: /ingwer/i, sizes: [100], base: "g", unit: "Stück" },
  { match: /tomaten.*dose|passierte tomaten|gehackte tomaten/i, sizes: [400, 500], base: "g", unit: "Dose" },
  { match: /tomaten(?!.*mark)/i, sizes: [500, 1000], base: "g" },
  { match: /tomatenmark/i, sizes: [70, 200], base: "g", unit: "Tube/Dose" },
  { match: /paprika\b/i, sizes: [500], base: "g" },
  { match: /gurke/i, sizes: [1], base: "stk", unit: "Stück" },
  { match: /zucchini|aubergine/i, sizes: [1], base: "stk", unit: "Stück" },
  { match: /karotten|möhren/i, sizes: [500, 1000], base: "g", unit: "Bund/Beutel" },
  { match: /salat|rucola|feldsalat|baby leaf/i, sizes: [1], base: "stk", unit: "Kopf/Beutel" },
  { match: /spinat\b/i, sizes: [250, 500], base: "g" },
  { match: /brokkoli|blumenkohl/i, sizes: [1], base: "stk", unit: "Kopf" },
  { match: /champignons|pilze/i, sizes: [250, 500], base: "g", unit: "Schale" },
  { match: /avocado/i, sizes: [1], base: "stk", unit: "Stück" },
  { match: /zitrone|limette/i, sizes: [1], base: "stk", unit: "Stück" },

  // Konserven/Sauce
  { match: /kokosmilch/i, sizes: [400], base: "ml", unit: "Dose" },
  { match: /olivenöl/i, sizes: [500, 750, 1000], base: "ml", unit: "Flasche" },
  { match: /sojasauce|sojasoße|soja sauce/i, sizes: [150, 250, 500], base: "ml", unit: "Flasche" },
  { match: /essig|balsamico/i, sizes: [250, 500], base: "ml", unit: "Flasche" },

  // Eier
  { match: /eier|ei\b/i, sizes: [6, 10], base: "stk", unit: "Packung" },

  // Kräuter
  { match: /petersilie|basilikum|koriander|dill|minze|rosmarin|thymian|schnittlauch/i, sizes: [1], base: "stk", unit: "Bund/Topf" },

  // Brot
  { match: /brot|baguette|ciabatta|fladenbrot|pita/i, sizes: [1], base: "stk", unit: "Stück" },
];

/** Sum amount for adrian+janina in base unit. */
export function computeTotal(ing: Ingredient): { total: number; base: "g" | "ml" | "stk" } {
  const a = parseNumber(ing.amount_adrian);
  const j = parseNumber(ing.amount_janina);
  const conv = toBaseAmount(a + j, ing.unit);
  return { total: conv.amount, base: conv.base };
}

/** Round total up to next typical package size. */
export function roundToPackage(
  ing: Ingredient
): { display: string; packageSize: string | null; packs: number } {
  const { total, base } = computeTotal(ing);
  if (total <= 0) {
    return { display: `${ing.amount_adrian || ""} ${ing.unit}`.trim(), packageSize: null, packs: 0 };
  }

  const rule = PACK_RULES.find((r) => r.match.test(ing.name) && r.base === base);

  if (!rule) {
    // No packaging info: just show rounded total
    const rounded = base === "stk" ? Math.ceil(total) : Math.round(total);
    return {
      display: base === "stk" ? `${rounded} ${ing.unit}` : `${rounded}${base}`,
      packageSize: null,
      packs: 0,
    };
  }

  // Find smallest package ≥ total, or combine packs of largest size
  const sizes = [...rule.sizes].sort((a, b) => a - b);
  const largest = sizes[sizes.length - 1];

  let packs = 1;
  let packSize = sizes.find((s) => s >= total);
  if (!packSize) {
    // Total exceeds largest — use multiple of largest
    packSize = largest;
    packs = Math.ceil(total / largest);
  }

  const totalBought = packSize * packs;
  const unitLabel = rule.unit ?? (base === "stk" ? "Stück" : "");
  const sizeLabel = base === "stk" ? `${packSize}${unitLabel ? " " + unitLabel : ""}` : `${packSize}${base}`;

  const display =
    packs > 1
      ? `${packs}× ${sizeLabel} (${totalBought}${base === "stk" ? "" : base})`
      : sizeLabel;

  const needLabel = base === "stk" ? `${Math.ceil(total)}` : `${Math.round(total)}${base}`;

  return {
    display,
    packageSize: `benötigt: ${needLabel}`,
    packs,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Store recommendation
// ────────────────────────────────────────────────────────────────────────────

/**
 * Preferenz-Ranking pro Kategorie. Idee: Aldi/Lidl für Basics & Fleisch-Standards
 * (günstig), Rewe/Edeka für Spezialitäten, frische Kräuter, internationale Zutaten.
 *
 * Live-Prospekt-APIs existieren für diese Ketten nicht öffentlich — wir rotieren
 * daher deterministisch, damit ihr nicht in nur einen Laden geschickt werdet.
 */
const CATEGORY_PREFS: Record<string, Store[]> = {
  "Fleisch/Fisch": ["Aldi", "Lidl", "Rewe", "Edeka"],
  "Gemüse": ["Aldi", "Lidl", "Rewe", "Edeka"],
  "Milchprodukte": ["Lidl", "Aldi", "Rewe", "Edeka"],
  "Gewürze": ["Rewe", "Edeka", "Aldi", "Lidl"],
  "Getreide/Hülsenfrüchte": ["Aldi", "Lidl", "Rewe", "Edeka"],
  "Sonstiges": ["Rewe", "Edeka", "Aldi", "Lidl"],
};

// Sonderfälle: bestimmte Zutaten haben klare Best-Anlaufstellen
const INGREDIENT_OVERRIDES: { match: RegExp; prefs: Store[] }[] = [
  { match: /lachs|garnelen|thunfisch|kabeljau/i, prefs: ["Edeka", "Rewe", "Aldi", "Lidl"] },
  { match: /parmesan|mozzarella|feta|pecorino/i, prefs: ["Rewe", "Edeka", "Aldi", "Lidl"] },
  { match: /rinderfilet|entrecôte|lamm/i, prefs: ["Edeka", "Rewe", "Aldi", "Lidl"] },
  { match: /kokosmilch|sojasauce|curry|kichererbsen|couscous|bulgur|quinoa/i, prefs: ["Rewe", "Edeka", "Aldi", "Lidl"] },
  { match: /basilikum|koriander|minze|rosmarin|thymian/i, prefs: ["Rewe", "Edeka", "Aldi", "Lidl"] },
];

/** Pick best available store for an item from location's store set. */
export function recommendStore(
  name: string,
  category: string,
  available: Store[]
): Store {
  const override = INGREDIENT_OVERRIDES.find((o) => o.match.test(name));
  const prefs = override?.prefs ?? CATEGORY_PREFS[category] ?? ["Aldi", "Lidl", "Rewe", "Edeka"];
  const pick = prefs.find((s) => available.includes(s));
  return pick ?? available[0];
}

// ────────────────────────────────────────────────────────────────────────────
// Location persistence
// ────────────────────────────────────────────────────────────────────────────

const LOC_KEY = "w2e_location";

export function getLocation(): LocationKey | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(LOC_KEY);
  return v === "bad_soden" || v === "muenzenberg" ? v : null;
}

export function setLocation(key: LocationKey) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOC_KEY, key);
}
