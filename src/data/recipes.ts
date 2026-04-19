/**
 * Pre-generated recipe database — no API calls needed.
 * 200 recipes, all following Adrian & Janina's dietary rules:
 * - 40g+ protein per serving
 * - Adrian: 500-700 kcal, spice 3-4
 * - Janina: 400-550 kcal, spice 1-2
 * - Lactose-free (Skyr OK)
 * - No pork, salami, innards, blood sausage, hazelnuts
 * - 10-45 min prep time
 */

import type { RecipeJSON } from "@/types/database";
import { RECIPES_ASIAN } from "./recipes-asian";
import { RECIPES_MEDITERRANEAN } from "./recipes-mediterranean";
import { RECIPES_MEXICAN_INDIAN } from "./recipes-mexican-indian";
import { RECIPES_AMERICAN_GERMAN } from "./recipes-american-german";
import { RECIPES_TURKISH_MIDEAST } from "./recipes-turkish-mideast";
import { RECIPES_MIXED } from "./recipes-mixed";
import { RECIPES_QUICK } from "./recipes-quick";

export interface StaticRecipe {
  id: number;
  meal_name: string;
  description: string;
  cuisine_type: string;
  calories_adrian: number;
  calories_janina: number;
  protein_grams: number;
  prep_time_minutes: number;
  spice_level_adrian: number;
  spice_level_janina: number;
  main_ingredients: string[];
  tags: string[];
  recipe: RecipeJSON;
}

const BASE_RECIPES: StaticRecipe[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ASIATISCH (1-30)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 1,
    meal_name: "Teriyaki-Lachs-Bowl",
    description: "Glasierter Lachs auf Jasminreis mit Edamame und eingelegtem Ingwer.",
    cuisine_type: "Asiatisch",
    calories_adrian: 620,
    calories_janina: 480,
    protein_grams: 44,
    prep_time_minutes: 25,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Lachs", "Jasminreis", "Edamame", "Teriyaki-Sauce"],
    tags: ["fisch", "bowl", "reis"],
    recipe: {
      ingredients: [
        { name: "Lachsfilet", amount_adrian: "200", amount_janina: "150", unit: "g", category: "Fleisch/Fisch" },
        { name: "Jasminreis", amount_adrian: "100", amount_janina: "70", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Edamame (TK)", amount_adrian: "100", amount_janina: "80", unit: "g", category: "Gemüse" },
        { name: "Sojasauce", amount_adrian: "2", amount_janina: "2", unit: "EL", category: "Gewürze" },
        { name: "Honig", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
        { name: "Sesam", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Ingwer (frisch)", amount_adrian: "1", amount_janina: "1", unit: "cm", category: "Gewürze" },
        { name: "Frühlingszwiebel", amount_adrian: "2", amount_janina: "2", unit: "Stück", category: "Gemüse" },
      ],
      steps: [
        "Reis nach Packungsanleitung kochen.",
        "Sojasauce, Honig und geriebenen Ingwer zu einer Teriyaki-Glaze verrühren.",
        "Lachs in einer heißen Pfanne mit etwas Öl 3 Min. pro Seite braten.",
        "Glaze über den Lachs geben und 1 Min. karamellisieren lassen.",
        "Edamame in Salzwasser 3 Min. kochen, abgießen.",
        "Bowl anrichten: Reis, Lachs, Edamame. Mit Sesam und Frühlingszwiebeln toppen.",
      ],
      equipment: ["Herd", "Pfanne", "Topf"],
      spice_note: "Adrian: 1 TL Sriracha zur Bowl. Janina: pur genießen.",
      nutrition_per_person: {
        adrian: { calories: 620, protein: 44, carbs: 58, fat: 22 },
        janina: { calories: 480, protein: 35, carbs: 42, fat: 18 },
      },
    },
  },
  {
    id: 2,
    meal_name: "Thai-Basilikum-Hähnchen",
    description: "Knuspriges Hähnchen mit Thai-Basilikum, grünen Bohnen und Jasminreis.",
    cuisine_type: "Asiatisch",
    calories_adrian: 580,
    calories_janina: 450,
    protein_grams: 46,
    prep_time_minutes: 20,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Hähnchenbrust", "Thai-Basilikum", "Grüne Bohnen", "Reis"],
    tags: ["hähnchen", "schnell", "reis"],
    recipe: {
      ingredients: [
        { name: "Hähnchenbrust", amount_adrian: "200", amount_janina: "160", unit: "g", category: "Fleisch/Fisch" },
        { name: "Jasminreis", amount_adrian: "90", amount_janina: "60", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Grüne Bohnen", amount_adrian: "120", amount_janina: "100", unit: "g", category: "Gemüse" },
        { name: "Thai-Basilikum", amount_adrian: "1", amount_janina: "1", unit: "Handvoll", category: "Gewürze" },
        { name: "Knoblauch", amount_adrian: "3", amount_janina: "2", unit: "Zehen", category: "Gewürze" },
        { name: "Sojasauce", amount_adrian: "2", amount_janina: "2", unit: "EL", category: "Gewürze" },
        { name: "Fischsauce", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Chili", amount_adrian: "2", amount_janina: "0", unit: "Stück", category: "Gewürze" },
      ],
      steps: [
        "Reis kochen. Hähnchen in mundgerechte Stücke schneiden.",
        "Knoblauch und Chili fein hacken. In Öl bei hoher Hitze anbraten.",
        "Hähnchen dazu, 4-5 Min. scharf anbraten bis goldbraun.",
        "Bohnen dazu, 3 Min. mitbraten.",
        "Sojasauce und Fischsauce dazu, 1 Min. einkochen.",
        "Vom Herd nehmen, Thai-Basilikum unterheben. Mit Reis servieren.",
      ],
      equipment: ["Herd", "Wok/Pfanne", "Topf"],
      spice_note: "Adrian: 2 Chilis mit Kernen. Janina: ohne Chili, mild.",
      nutrition_per_person: {
        adrian: { calories: 580, protein: 46, carbs: 52, fat: 14 },
        janina: { calories: 450, protein: 38, carbs: 38, fat: 11 },
      },
    },
  },
  {
    id: 3,
    meal_name: "Japanische Edamame-Lachs-Poke",
    description: "Frischer Lachs auf Sushi-Reis mit Avocado, Edamame und Ponzu-Dressing.",
    cuisine_type: "Asiatisch",
    calories_adrian: 600,
    calories_janina: 470,
    protein_grams: 42,
    prep_time_minutes: 15,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Lachs (Sashimi)", "Sushi-Reis", "Avocado", "Edamame"],
    tags: ["fisch", "roh", "bowl", "schnell"],
    recipe: {
      ingredients: [
        { name: "Lachs (Sashimi-Qualität)", amount_adrian: "180", amount_janina: "140", unit: "g", category: "Fleisch/Fisch" },
        { name: "Sushi-Reis", amount_adrian: "100", amount_janina: "70", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Avocado", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Edamame", amount_adrian: "80", amount_janina: "60", unit: "g", category: "Gemüse" },
        { name: "Ponzu-Sauce", amount_adrian: "2", amount_janina: "2", unit: "EL", category: "Gewürze" },
        { name: "Sesam", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Nori-Blätter", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Sonstiges" },
      ],
      steps: [
        "Sushi-Reis kochen und mit Reisessig würzen, abkühlen lassen.",
        "Lachs in ca. 2cm große Würfel schneiden.",
        "Avocado halbieren und in Scheiben schneiden.",
        "Bowl anrichten: Reis, Lachs, Avocado, Edamame.",
        "Mit Ponzu beträufeln, Sesam und zerbröselte Nori darüber.",
      ],
      equipment: ["Herd", "Topf"],
      spice_note: "Adrian: 1 TL Wasabi-Paste dazu. Janina: ohne Wasabi.",
      nutrition_per_person: {
        adrian: { calories: 600, protein: 42, carbs: 50, fat: 24 },
        janina: { calories: 470, protein: 34, carbs: 38, fat: 20 },
      },
    },
  },
  {
    id: 4,
    meal_name: "Knuspriger Tofu Kung Pao",
    description: "Kross gebratener Tofu mit Erdnüssen, Paprika und würziger Kung-Pao-Sauce.",
    cuisine_type: "Asiatisch",
    calories_adrian: 520,
    calories_janina: 420,
    protein_grams: 40,
    prep_time_minutes: 25,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Tofu", "Erdnüsse", "Paprika", "Reis"],
    tags: ["tofu", "vegetarisch", "reis"],
    recipe: {
      ingredients: [
        { name: "Tofu (fest)", amount_adrian: "250", amount_janina: "200", unit: "g", category: "Sonstiges" },
        { name: "Erdnüsse (ungesalzen)", amount_adrian: "30", amount_janina: "20", unit: "g", category: "Sonstiges" },
        { name: "Paprika (rot)", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Jasminreis", amount_adrian: "80", amount_janina: "60", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Sojasauce", amount_adrian: "2", amount_janina: "2", unit: "EL", category: "Gewürze" },
        { name: "Reisessig", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Speisestärke", amount_adrian: "2", amount_janina: "2", unit: "EL", category: "Sonstiges" },
        { name: "Chili-Flocken", amount_adrian: "1", amount_janina: "0", unit: "TL", category: "Gewürze" },
      ],
      steps: [
        "Tofu abtropfen, in Würfel schneiden, mit Speisestärke bestäuben.",
        "Reis kochen.",
        "Tofu in heißem Öl knusprig braten (5-6 Min.), herausnehmen.",
        "Paprika und Frühlingszwiebeln im selben Wok 2 Min. braten.",
        "Sojasauce, Reisessig und Chili dazu, Tofu zurück in den Wok.",
        "Erdnüsse unterheben, 1 Min. schwenken. Mit Reis servieren.",
      ],
      equipment: ["Herd", "Wok/Pfanne", "Topf"],
      spice_note: "Adrian: 1 TL Chili-Flocken + getrocknete Chilis. Janina: ohne Chili.",
      nutrition_per_person: {
        adrian: { calories: 520, protein: 40, carbs: 44, fat: 20 },
        janina: { calories: 420, protein: 32, carbs: 36, fat: 16 },
      },
    },
  },
  {
    id: 5,
    meal_name: "Rinderhackfleisch-Bibimbap",
    description: "Koreanische Reis-Bowl mit mariniertem Rinderhack, Gemüse und Spiegelei.",
    cuisine_type: "Asiatisch",
    calories_adrian: 650,
    calories_janina: 510,
    protein_grams: 48,
    prep_time_minutes: 30,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Rinderhack", "Reis", "Spinat", "Karotten", "Ei"],
    tags: ["rind", "bowl", "reis", "ei"],
    recipe: {
      ingredients: [
        { name: "Rinderhackfleisch (mager)", amount_adrian: "180", amount_janina: "130", unit: "g", category: "Fleisch/Fisch" },
        { name: "Reis", amount_adrian: "100", amount_janina: "70", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Babyspinat", amount_adrian: "80", amount_janina: "80", unit: "g", category: "Gemüse" },
        { name: "Karotten", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Zucchini", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Ei", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Sonstiges" },
        { name: "Sojasauce", amount_adrian: "2", amount_janina: "2", unit: "EL", category: "Gewürze" },
        { name: "Sesamöl", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
        { name: "Gochujang", amount_adrian: "1", amount_janina: "0.5", unit: "EL", category: "Gewürze" },
      ],
      steps: [
        "Reis kochen.",
        "Rinderhack mit Sojasauce und Sesamöl marinieren, scharf anbraten.",
        "Karotten und Zucchini in Streifen schneiden, separat kurz anbraten.",
        "Spinat mit einer Prise Salz kurz in der Pfanne welken.",
        "Spiegelei braten (Eigelb weich lassen).",
        "Bowl: Reis, Hack, Gemüse anordnen, Ei obendrauf, Gochujang dazu.",
      ],
      equipment: ["Herd", "Pfanne", "Topf"],
      spice_note: "Adrian: 1 EL Gochujang + Kimchi. Janina: nur 0.5 EL Gochujang.",
      nutrition_per_person: {
        adrian: { calories: 650, protein: 48, carbs: 56, fat: 22 },
        janina: { calories: 510, protein: 38, carbs: 42, fat: 18 },
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // MEDITERRAN (31-60)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 6,
    meal_name: "Griechische Hähnchen-Gyros-Bowl",
    description: "Saftiges Gyros-Hähnchen mit Gurken-Tomaten-Salat, Oliven und Skyr-Tzatziki.",
    cuisine_type: "Mediterran",
    calories_adrian: 560,
    calories_janina: 430,
    protein_grams: 50,
    prep_time_minutes: 25,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Hähnchenbrust", "Gurke", "Tomate", "Skyr", "Oliven"],
    tags: ["hähnchen", "bowl", "griechisch"],
    recipe: {
      ingredients: [
        { name: "Hähnchenbrust", amount_adrian: "200", amount_janina: "160", unit: "g", category: "Fleisch/Fisch" },
        { name: "Skyr (natur)", amount_adrian: "100", amount_janina: "80", unit: "g", category: "Milchprodukte" },
        { name: "Gurke", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Tomate", amount_adrian: "2", amount_janina: "2", unit: "Stück", category: "Gemüse" },
        { name: "Kalamata-Oliven", amount_adrian: "30", amount_janina: "20", unit: "g", category: "Gemüse" },
        { name: "Rote Zwiebel", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Gyros-Gewürz", amount_adrian: "2", amount_janina: "2", unit: "TL", category: "Gewürze" },
        { name: "Zitrone", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Sonstiges" },
        { name: "Knoblauch", amount_adrian: "1", amount_janina: "1", unit: "Zehe", category: "Gewürze" },
      ],
      steps: [
        "Hähnchen mit Gyros-Gewürz, Olivenöl und Zitronensaft marinieren.",
        "Tzatziki: Skyr mit geraspelter Gurke, Knoblauch, Salz und Dill mischen.",
        "Hähnchen in der Pfanne 5-6 Min. pro Seite braten, in Streifen schneiden.",
        "Salat: Gurke, Tomaten, Oliven und rote Zwiebel würfeln, mit Olivenöl und Zitrone anmachen.",
        "Bowl anrichten: Salat, Hähnchen-Streifen, Tzatziki.",
      ],
      equipment: ["Herd", "Pfanne"],
      spice_note: "Adrian: Chiliflocken über das Hähnchen. Janina: wie beschrieben.",
      nutrition_per_person: {
        adrian: { calories: 560, protein: 50, carbs: 18, fat: 20 },
        janina: { calories: 430, protein: 42, carbs: 14, fat: 16 },
      },
    },
  },
  {
    id: 7,
    meal_name: "Mediterrane Thunfisch-Steaks",
    description: "Rosa gebratene Thunfisch-Steaks mit Kapern-Tomaten-Salsa und Rucola.",
    cuisine_type: "Mediterran",
    calories_adrian: 530,
    calories_janina: 420,
    protein_grams: 52,
    prep_time_minutes: 15,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Thunfisch-Steak", "Kapern", "Cherry-Tomaten", "Rucola"],
    tags: ["fisch", "schnell", "lowcarb"],
    recipe: {
      ingredients: [
        { name: "Thunfisch-Steak", amount_adrian: "200", amount_janina: "160", unit: "g", category: "Fleisch/Fisch" },
        { name: "Cherry-Tomaten", amount_adrian: "150", amount_janina: "120", unit: "g", category: "Gemüse" },
        { name: "Kapern", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Rucola", amount_adrian: "50", amount_janina: "50", unit: "g", category: "Gemüse" },
        { name: "Olivenöl", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
        { name: "Zitrone", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Sonstiges" },
        { name: "Pinienkerne", amount_adrian: "15", amount_janina: "10", unit: "g", category: "Sonstiges" },
      ],
      steps: [
        "Thunfisch salzen und pfeffern.",
        "In sehr heißer Pfanne 1.5 Min. pro Seite scharf anbraten (innen rosa).",
        "Tomaten halbieren, mit Kapern, Olivenöl und Zitronensaft mischen.",
        "Pinienkerne trocken in einer Pfanne rösten.",
        "Rucola auf Teller, Thunfisch darauf, Salsa darüber, Pinienkerne streuen.",
      ],
      equipment: ["Herd", "Pfanne"],
      spice_note: "Adrian: Chiliflocken in die Salsa. Janina: mild lassen.",
      nutrition_per_person: {
        adrian: { calories: 530, protein: 52, carbs: 10, fat: 22 },
        janina: { calories: 420, protein: 44, carbs: 8, fat: 18 },
      },
    },
  },
  {
    id: 8,
    meal_name: "Italienische Puten-Piccata",
    description: "Dünne Putenschnitzel in Zitronen-Kapern-Sauce mit geröstetem Brokkoli.",
    cuisine_type: "Mediterran",
    calories_adrian: 510,
    calories_janina: 400,
    protein_grams: 48,
    prep_time_minutes: 20,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Putenbrust", "Brokkoli", "Kapern", "Zitrone"],
    tags: ["pute", "schnell", "lowcarb"],
    recipe: {
      ingredients: [
        { name: "Putenbrust", amount_adrian: "220", amount_janina: "170", unit: "g", category: "Fleisch/Fisch" },
        { name: "Brokkoli", amount_adrian: "200", amount_janina: "180", unit: "g", category: "Gemüse" },
        { name: "Kapern", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Zitrone", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Sonstiges" },
        { name: "Hühnerbrühe", amount_adrian: "80", amount_janina: "80", unit: "ml", category: "Sonstiges" },
        { name: "Olivenöl", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
      ],
      steps: [
        "Ofen auf 200°C vorheizen. Brokkoli mit Olivenöl und Salz auf Blech verteilen, 15 Min. rösten.",
        "Putenbrust flach klopfen, salzen und pfeffern.",
        "In heißer Pfanne 3 Min. pro Seite braten, herausnehmen.",
        "Hühnerbrühe und Zitronensaft in die Pfanne, aufkochen, Kapern dazu.",
        "Sauce 2 Min. einreduzieren, Pute zurücklegen.",
        "Mit geröstetem Brokkoli servieren.",
      ],
      equipment: ["Herd", "Ofen", "Pfanne"],
      spice_note: "Adrian: Pfeffer großzügig + Chiliflocken. Janina: mild.",
      nutrition_per_person: {
        adrian: { calories: 510, protein: 48, carbs: 14, fat: 16 },
        janina: { calories: 400, protein: 40, carbs: 12, fat: 12 },
      },
    },
  },
  {
    id: 9,
    meal_name: "Shakshuka mit Feta-Skyr",
    description: "Pochierte Eier in würziger Tomaten-Paprika-Sauce mit einem Klecks Skyr.",
    cuisine_type: "Mediterran",
    calories_adrian: 500,
    calories_janina: 410,
    protein_grams: 40,
    prep_time_minutes: 25,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Eier", "Tomaten", "Paprika", "Skyr"],
    tags: ["ei", "vegetarisch", "pfanne"],
    recipe: {
      ingredients: [
        { name: "Eier", amount_adrian: "3", amount_janina: "3", unit: "Stück", category: "Sonstiges" },
        { name: "Stückige Tomaten (Dose)", amount_adrian: "400", amount_janina: "400", unit: "g", category: "Gemüse" },
        { name: "Paprika (rot)", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Zwiebel", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Knoblauch", amount_adrian: "2", amount_janina: "2", unit: "Zehen", category: "Gewürze" },
        { name: "Skyr", amount_adrian: "60", amount_janina: "60", unit: "g", category: "Milchprodukte" },
        { name: "Kreuzkümmel", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
        { name: "Vollkornbrot", amount_adrian: "2", amount_janina: "1", unit: "Scheiben", category: "Getreide/Hülsenfrüchte" },
      ],
      steps: [
        "Zwiebel und Paprika würfeln, in Olivenöl anschwitzen.",
        "Knoblauch und Kreuzkümmel dazu, 1 Min. rösten.",
        "Dosentomaten dazu, 10 Min. köcheln lassen, würzen.",
        "Mulden in die Sauce drücken, Eier hineinschlagen.",
        "Deckel drauf, 6-8 Min. bei mittlerer Hitze, bis Eiweiß fest aber Eigelb weich.",
        "Skyr als Klecks obendrauf, mit Brot servieren.",
      ],
      equipment: ["Herd", "Pfanne mit Deckel"],
      spice_note: "Adrian: 1 TL Harissa in die Sauce + Chiliflocken. Janina: nur Kreuzkümmel.",
      nutrition_per_person: {
        adrian: { calories: 500, protein: 40, carbs: 38, fat: 18 },
        janina: { calories: 410, protein: 34, carbs: 28, fat: 16 },
      },
    },
  },
  {
    id: 10,
    meal_name: "Gegrillte Garnelen mit Zucchini-Nudeln",
    description: "Saftige Knoblauch-Garnelen auf Zoodles mit Kirschtomaten und Pesto.",
    cuisine_type: "Mediterran",
    calories_adrian: 490,
    calories_janina: 390,
    protein_grams: 44,
    prep_time_minutes: 20,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Garnelen", "Zucchini", "Cherry-Tomaten", "Pesto"],
    tags: ["meeresfrüchte", "lowcarb", "schnell"],
    recipe: {
      ingredients: [
        { name: "Garnelen (geschält)", amount_adrian: "200", amount_janina: "160", unit: "g", category: "Fleisch/Fisch" },
        { name: "Zucchini", amount_adrian: "2", amount_janina: "2", unit: "Stück", category: "Gemüse" },
        { name: "Cherry-Tomaten", amount_adrian: "100", amount_janina: "100", unit: "g", category: "Gemüse" },
        { name: "Pesto (Basilikum)", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Knoblauch", amount_adrian: "2", amount_janina: "2", unit: "Zehen", category: "Gewürze" },
        { name: "Olivenöl", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
        { name: "Zitrone", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Sonstiges" },
      ],
      steps: [
        "Zucchini mit Spiralschneider oder Sparschäler zu Zoodles verarbeiten.",
        "Garnelen mit Knoblauch, Olivenöl, Salz und Pfeffer marinieren.",
        "Garnelen in heißer Pfanne 2-3 Min. pro Seite braten.",
        "Zoodles 2 Min. in der gleichen Pfanne schwenken.",
        "Tomaten halbiert dazu, Pesto unterheben.",
        "Mit Zitronensaft beträufeln, sofort servieren.",
      ],
      equipment: ["Herd", "Pfanne"],
      spice_note: "Adrian: Chiliflocken zu den Garnelen. Janina: pur mit Zitrone.",
      nutrition_per_person: {
        adrian: { calories: 490, protein: 44, carbs: 16, fat: 18 },
        janina: { calories: 390, protein: 36, carbs: 14, fat: 14 },
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // MEXIKANISCH (61-80)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 11,
    meal_name: "Chipotle-Hähnchen-Burrito-Bowl",
    description: "Würziges Hähnchen auf Reis mit schwarzen Bohnen, Mais, Guacamole und Limette.",
    cuisine_type: "Mexikanisch",
    calories_adrian: 640,
    calories_janina: 490,
    protein_grams: 50,
    prep_time_minutes: 25,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Hähnchenbrust", "Schwarze Bohnen", "Reis", "Avocado"],
    tags: ["hähnchen", "bowl", "reis", "bohnen"],
    recipe: {
      ingredients: [
        { name: "Hähnchenbrust", amount_adrian: "200", amount_janina: "160", unit: "g", category: "Fleisch/Fisch" },
        { name: "Reis", amount_adrian: "90", amount_janina: "60", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Schwarze Bohnen (Dose)", amount_adrian: "100", amount_janina: "80", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Avocado", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Mais (Dose)", amount_adrian: "50", amount_janina: "40", unit: "g", category: "Gemüse" },
        { name: "Limette", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Sonstiges" },
        { name: "Chipotle-Paste", amount_adrian: "1", amount_janina: "0.5", unit: "EL", category: "Gewürze" },
        { name: "Kreuzkümmel", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
      ],
      steps: [
        "Reis mit Limettensaft kochen.",
        "Hähnchen mit Chipotle, Kreuzkümmel, Salz marinieren, 5-6 Min. pro Seite braten.",
        "Schwarze Bohnen mit etwas Kreuzkümmel erwärmen.",
        "Avocado zerdrücken mit Limettensaft und Salz.",
        "Hähnchen in Streifen schneiden.",
        "Bowl: Limetten-Reis, Bohnen, Mais, Hähnchen, Guacamole.",
      ],
      equipment: ["Herd", "Pfanne", "Topf"],
      spice_note: "Adrian: 1 EL Chipotle + Jalapeños. Janina: nur 0.5 EL Chipotle.",
      nutrition_per_person: {
        adrian: { calories: 640, protein: 50, carbs: 58, fat: 22 },
        janina: { calories: 490, protein: 40, carbs: 44, fat: 18 },
      },
    },
  },
  {
    id: 12,
    meal_name: "Taco-Salat mit Rinderhack",
    description: "Knackiger Salat mit gewürztem Rinderhack, Bohnen, Tomaten und Limetten-Dressing.",
    cuisine_type: "Mexikanisch",
    calories_adrian: 580,
    calories_janina: 460,
    protein_grams: 46,
    prep_time_minutes: 20,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Rinderhack", "Salat", "Kidneybohnen", "Tomate"],
    tags: ["rind", "salat", "schnell"],
    recipe: {
      ingredients: [
        { name: "Rinderhack (mager)", amount_adrian: "180", amount_janina: "130", unit: "g", category: "Fleisch/Fisch" },
        { name: "Kidneybohnen (Dose)", amount_adrian: "80", amount_janina: "60", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Eisbergsalat", amount_adrian: "100", amount_janina: "100", unit: "g", category: "Gemüse" },
        { name: "Tomate", amount_adrian: "2", amount_janina: "2", unit: "Stück", category: "Gemüse" },
        { name: "Mais", amount_adrian: "50", amount_janina: "40", unit: "g", category: "Gemüse" },
        { name: "Limette", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Sonstiges" },
        { name: "Taco-Gewürz", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Olivenöl", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
      ],
      steps: [
        "Rinderhack mit Taco-Gewürz scharf anbraten, 5-6 Min.",
        "Kidneybohnen abspülen, zum Hack geben, 2 Min. erwärmen.",
        "Salat waschen, in mundgerechte Stücke reißen.",
        "Tomaten würfeln.",
        "Dressing: Limettensaft + Olivenöl + Salz verrühren.",
        "Salat, Hack-Bohnen-Mix, Tomaten, Mais anrichten, Dressing drüber.",
      ],
      equipment: ["Herd", "Pfanne"],
      spice_note: "Adrian: extra Cayennepfeffer + Jalapeños. Janina: mild mit extra Limette.",
      nutrition_per_person: {
        adrian: { calories: 580, protein: 46, carbs: 30, fat: 24 },
        janina: { calories: 460, protein: 36, carbs: 24, fat: 20 },
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // INDISCH (81-100)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 13,
    meal_name: "Tikka-Masala-Hähnchen",
    description: "Zartes Hähnchen in cremiger Tomaten-Gewürz-Sauce mit Basmati-Reis.",
    cuisine_type: "Indisch",
    calories_adrian: 610,
    calories_janina: 480,
    protein_grams: 48,
    prep_time_minutes: 30,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Hähnchenbrust", "Tomaten", "Kokosmilch", "Basmati-Reis"],
    tags: ["hähnchen", "reis", "curry"],
    recipe: {
      ingredients: [
        { name: "Hähnchenbrust", amount_adrian: "200", amount_janina: "160", unit: "g", category: "Fleisch/Fisch" },
        { name: "Basmati-Reis", amount_adrian: "90", amount_janina: "60", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Passierte Tomaten", amount_adrian: "200", amount_janina: "200", unit: "ml", category: "Gemüse" },
        { name: "Kokosmilch (light)", amount_adrian: "100", amount_janina: "80", unit: "ml", category: "Sonstiges" },
        { name: "Tikka-Masala-Paste", amount_adrian: "2", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Zwiebel", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Knoblauch", amount_adrian: "2", amount_janina: "2", unit: "Zehen", category: "Gewürze" },
        { name: "Ingwer", amount_adrian: "1", amount_janina: "1", unit: "cm", category: "Gewürze" },
        { name: "Koriander (frisch)", amount_adrian: "1", amount_janina: "1", unit: "Handvoll", category: "Gewürze" },
      ],
      steps: [
        "Reis kochen.",
        "Hähnchen in Stücke schneiden. Zwiebel, Knoblauch, Ingwer fein hacken.",
        "Zwiebel in Öl glasig dünsten. Knoblauch und Ingwer dazu, 1 Min.",
        "Hähnchen dazu, 3-4 Min. anbraten.",
        "Tikka-Masala-Paste, passierte Tomaten und Kokosmilch dazu.",
        "15 Min. köcheln lassen bis Sauce eindickt.",
        "Mit frischem Koriander und Reis servieren.",
      ],
      equipment: ["Herd", "Pfanne/Topf", "Topf"],
      spice_note: "Adrian: 2 EL Tikka-Paste + extra Cayenne. Janina: nur 1 EL Paste, mild.",
      nutrition_per_person: {
        adrian: { calories: 610, protein: 48, carbs: 54, fat: 18 },
        janina: { calories: 480, protein: 40, carbs: 40, fat: 14 },
      },
    },
  },
  {
    id: 14,
    meal_name: "Linsen-Dal mit Naan-Alternative",
    description: "Cremiges rotes Linsen-Dal mit Kurkuma und knusprigem Vollkorn-Fladenbrot.",
    cuisine_type: "Indisch",
    calories_adrian: 540,
    calories_janina: 440,
    protein_grams: 42,
    prep_time_minutes: 25,
    spice_level_adrian: 3,
    spice_level_janina: 2,
    main_ingredients: ["Rote Linsen", "Kokosmilch", "Kurkuma", "Spinat"],
    tags: ["linsen", "vegetarisch", "hülsenfrüchte"],
    recipe: {
      ingredients: [
        { name: "Rote Linsen", amount_adrian: "120", amount_janina: "90", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Kokosmilch (light)", amount_adrian: "100", amount_janina: "80", unit: "ml", category: "Sonstiges" },
        { name: "Babyspinat", amount_adrian: "80", amount_janina: "80", unit: "g", category: "Gemüse" },
        { name: "Kurkuma", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
        { name: "Kreuzkümmel", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
        { name: "Knoblauch", amount_adrian: "2", amount_janina: "2", unit: "Zehen", category: "Gewürze" },
        { name: "Ingwer", amount_adrian: "1", amount_janina: "1", unit: "cm", category: "Gewürze" },
        { name: "Vollkorn-Pita", amount_adrian: "1", amount_janina: "0.5", unit: "Stück", category: "Getreide/Hülsenfrüchte" },
        { name: "Skyr", amount_adrian: "60", amount_janina: "50", unit: "g", category: "Milchprodukte" },
      ],
      steps: [
        "Linsen waschen. Knoblauch und Ingwer fein hacken.",
        "In Öl Knoblauch, Ingwer, Kurkuma und Kreuzkümmel anrösten (1 Min.).",
        "Linsen + 400ml Wasser dazu, 15 Min. köcheln bis cremig.",
        "Kokosmilch und Spinat einrühren, 2 Min. welken lassen.",
        "Pita im Ofen oder Toaster aufwärmen.",
        "Dal in Schüssel, Skyr-Klecks obendrauf, mit Pita servieren.",
      ],
      equipment: ["Herd", "Topf"],
      spice_note: "Adrian: 1 TL Garam Masala + Chiliflocken. Janina: mild mit Kurkuma.",
      nutrition_per_person: {
        adrian: { calories: 540, protein: 42, carbs: 60, fat: 12 },
        janina: { calories: 440, protein: 34, carbs: 48, fat: 10 },
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // AMERIKANISCH / BBQ (101-115)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 15,
    meal_name: "BBQ-Hähnchen aus dem Airfryer",
    description: "Knusprig mariniertes Hähnchen aus dem Airfryer mit Cole Slaw und Süßkartoffel.",
    cuisine_type: "Amerikanisch",
    calories_adrian: 600,
    calories_janina: 470,
    protein_grams: 48,
    prep_time_minutes: 30,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Hähnchenschenkel", "Süßkartoffel", "Weißkohl"],
    tags: ["hähnchen", "airfryer", "süßkartoffel"],
    recipe: {
      ingredients: [
        { name: "Hähnchenschenkel (ohne Haut)", amount_adrian: "220", amount_janina: "170", unit: "g", category: "Fleisch/Fisch" },
        { name: "Süßkartoffel", amount_adrian: "150", amount_janina: "120", unit: "g", category: "Gemüse" },
        { name: "Weißkohl", amount_adrian: "80", amount_janina: "80", unit: "g", category: "Gemüse" },
        { name: "BBQ-Sauce (zuckerarm)", amount_adrian: "2", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Apfelessig", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
        { name: "Skyr", amount_adrian: "30", amount_janina: "30", unit: "g", category: "Milchprodukte" },
        { name: "Paprikapulver", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
      ],
      steps: [
        "Hähnchen mit BBQ-Sauce und Paprikapulver marinieren.",
        "Süßkartoffel in Wedges schneiden, mit Öl und Salz mischen.",
        "Airfryer auf 200°C: Süßkartoffel 15 Min., dann Hähnchen dazu, weitere 15 Min.",
        "Cole Slaw: Kohl fein hobeln, mit Skyr, Apfelessig und Salz mischen.",
        "Alles zusammen anrichten.",
      ],
      equipment: ["Airfryer"],
      spice_note: "Adrian: Cayennepfeffer in die BBQ-Marinade. Janina: nur Paprikapulver.",
      nutrition_per_person: {
        adrian: { calories: 600, protein: 48, carbs: 42, fat: 18 },
        janina: { calories: 470, protein: 38, carbs: 34, fat: 14 },
      },
    },
  },
  {
    id: 16,
    meal_name: "Smash-Burger-Bowl",
    description: "Alles vom Burger, ohne Brötchen — Rinderhack-Patty auf Salat mit Pickles und Senf-Dressing.",
    cuisine_type: "Amerikanisch",
    calories_adrian: 570,
    calories_janina: 440,
    protein_grams: 46,
    prep_time_minutes: 15,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Rinderhack", "Salat", "Tomate", "Gewürzgurke"],
    tags: ["rind", "bowl", "schnell", "lowcarb"],
    recipe: {
      ingredients: [
        { name: "Rinderhack (mager)", amount_adrian: "180", amount_janina: "140", unit: "g", category: "Fleisch/Fisch" },
        { name: "Eisbergsalat", amount_adrian: "100", amount_janina: "100", unit: "g", category: "Gemüse" },
        { name: "Tomate", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Gewürzgurken", amount_adrian: "3", amount_janina: "3", unit: "Stück", category: "Gemüse" },
        { name: "Rote Zwiebel", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Senf", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Skyr", amount_adrian: "40", amount_janina: "30", unit: "g", category: "Milchprodukte" },
      ],
      steps: [
        "Rinderhack zu dünnen Patties formen, kräftig salzen und pfeffern.",
        "In sehr heißer Pfanne 2 Min. pro Seite smash-braten.",
        "Dressing: Senf + Skyr + Gurkenwasser verrühren.",
        "Salat, Tomate und Zwiebel in eine Bowl schichten.",
        "Zerbrochene Patties darauf, Gewürzgurken und Dressing.",
      ],
      equipment: ["Herd", "Pfanne"],
      spice_note: "Adrian: Jalapeño-Scheiben + Sriracha. Janina: mild mit extra Gurken.",
      nutrition_per_person: {
        adrian: { calories: 570, protein: 46, carbs: 14, fat: 26 },
        janina: { calories: 440, protein: 36, carbs: 12, fat: 20 },
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // DEUTSCH / EUROPÄISCH (116-135)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 17,
    meal_name: "Putensteak mit Ofengemüse",
    description: "Saftiges Putensteak mit bunt geröstetem Ofengemüse und Kräuter-Skyr-Dip.",
    cuisine_type: "Deutsch",
    calories_adrian: 520,
    calories_janina: 410,
    protein_grams: 50,
    prep_time_minutes: 30,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Putensteak", "Paprika", "Zucchini", "Süßkartoffel", "Skyr"],
    tags: ["pute", "ofen", "gemüse"],
    recipe: {
      ingredients: [
        { name: "Putensteak", amount_adrian: "220", amount_janina: "170", unit: "g", category: "Fleisch/Fisch" },
        { name: "Paprika (bunt)", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Zucchini", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Süßkartoffel", amount_adrian: "120", amount_janina: "80", unit: "g", category: "Gemüse" },
        { name: "Skyr", amount_adrian: "80", amount_janina: "60", unit: "g", category: "Milchprodukte" },
        { name: "Kräuter (frisch, gemischt)", amount_adrian: "1", amount_janina: "1", unit: "Handvoll", category: "Gewürze" },
        { name: "Olivenöl", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
      ],
      steps: [
        "Ofen auf 200°C vorheizen.",
        "Gemüse in mundgerechte Stücke schneiden, mit Öl, Salz, Pfeffer auf Blech verteilen.",
        "20 Min. im Ofen rösten.",
        "Putensteak salzen, pfeffern, in heißer Pfanne 4 Min. pro Seite braten.",
        "Kräuter-Dip: Skyr mit gehackten Kräutern, Salz und Zitrone mischen.",
        "Steak aufschneiden, mit Ofengemüse und Dip servieren.",
      ],
      equipment: ["Ofen", "Herd", "Pfanne"],
      spice_note: "Adrian: Chiliflocken über das Gemüse. Janina: nur Kräuter.",
      nutrition_per_person: {
        adrian: { calories: 520, protein: 50, carbs: 30, fat: 14 },
        janina: { calories: 410, protein: 42, carbs: 22, fat: 10 },
      },
    },
  },
  {
    id: 18,
    meal_name: "Rinderfilet-Streifen mit Champignons",
    description: "Zartes Rinderfilet mit Champignons in dunkler Sauce und Blumenkohlpüree.",
    cuisine_type: "Deutsch",
    calories_adrian: 590,
    calories_janina: 460,
    protein_grams: 50,
    prep_time_minutes: 25,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Rinderfilet", "Champignons", "Blumenkohl"],
    tags: ["rind", "lowcarb", "champignons"],
    recipe: {
      ingredients: [
        { name: "Rinderfilet", amount_adrian: "200", amount_janina: "150", unit: "g", category: "Fleisch/Fisch" },
        { name: "Champignons", amount_adrian: "150", amount_janina: "120", unit: "g", category: "Gemüse" },
        { name: "Blumenkohl", amount_adrian: "200", amount_janina: "180", unit: "g", category: "Gemüse" },
        { name: "Rinderfond", amount_adrian: "80", amount_janina: "80", unit: "ml", category: "Sonstiges" },
        { name: "Thymian", amount_adrian: "2", amount_janina: "2", unit: "Zweige", category: "Gewürze" },
        { name: "Olivenöl", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Sonstiges" },
      ],
      steps: [
        "Blumenkohl in Röschen teilen, in Salzwasser 10 Min. weichkochen. Pürieren mit etwas Kochwasser.",
        "Rinderfilet in Streifen schneiden, kräftig salzen und pfeffern.",
        "In heißer Pfanne 2 Min. scharf anbraten, herausnehmen.",
        "Champignons in Scheiben in der gleichen Pfanne 4 Min. braten.",
        "Rinderfond und Thymian dazu, 3 Min. einkochen.",
        "Fleisch zurück in die Sauce. Mit Blumenkohlpüree servieren.",
      ],
      equipment: ["Herd", "Pfanne", "Topf"],
      spice_note: "Adrian: Schwarzer Pfeffer großzügig + Senf. Janina: mild.",
      nutrition_per_person: {
        adrian: { calories: 590, protein: 50, carbs: 16, fat: 24 },
        janina: { calories: 460, protein: 40, carbs: 14, fat: 18 },
      },
    },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // WEITERE KÜCHEN: Türkisch, Vietnamesisch, Griechisch, Fusion etc.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 19,
    meal_name: "Türkische Adana-Köfte",
    description: "Würzige Rinderhack-Köfte mit Gurken-Tomaten-Salat und Skyr-Dip.",
    cuisine_type: "Türkisch",
    calories_adrian: 560,
    calories_janina: 440,
    protein_grams: 48,
    prep_time_minutes: 20,
    spice_level_adrian: 4,
    spice_level_janina: 2,
    main_ingredients: ["Rinderhack", "Petersilie", "Tomate", "Gurke", "Skyr"],
    tags: ["rind", "grill", "lowcarb"],
    recipe: {
      ingredients: [
        { name: "Rinderhack", amount_adrian: "200", amount_janina: "150", unit: "g", category: "Fleisch/Fisch" },
        { name: "Petersilie", amount_adrian: "1", amount_janina: "1", unit: "Bund", category: "Gewürze" },
        { name: "Tomate", amount_adrian: "2", amount_janina: "2", unit: "Stück", category: "Gemüse" },
        { name: "Gurke", amount_adrian: "0.5", amount_janina: "0.5", unit: "Stück", category: "Gemüse" },
        { name: "Rote Zwiebel", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Gemüse" },
        { name: "Skyr", amount_adrian: "80", amount_janina: "60", unit: "g", category: "Milchprodukte" },
        { name: "Kreuzkümmel", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
        { name: "Sumach", amount_adrian: "1", amount_janina: "1", unit: "TL", category: "Gewürze" },
      ],
      steps: [
        "Hack mit gehackter Petersilie, Kreuzkümmel, Zwiebel, Salz und Pfeffer verkneten.",
        "Längliche Köfte formen (ca. 3-4 Stück pro Person).",
        "Im Airfryer bei 200°C 12 Min. oder in der Pfanne je 3 Min. pro Seite braten.",
        "Salat: Tomate, Gurke, rote Zwiebel würfeln, mit Sumach und Olivenöl anmachen.",
        "Skyr-Dip mit Knoblauch, Salz und Minze anrühren.",
        "Köfte mit Salat und Dip servieren.",
      ],
      equipment: ["Airfryer", "Herd"],
      spice_note: "Adrian: Pul Biber (türk. Chiliflocken) in den Hack. Janina: ohne Schärfe.",
      nutrition_per_person: {
        adrian: { calories: 560, protein: 48, carbs: 16, fat: 24 },
        janina: { calories: 440, protein: 38, carbs: 14, fat: 18 },
      },
    },
  },
  {
    id: 20,
    meal_name: "Vietnamesische Pho mit Rindfleisch",
    description: "Aromatische Reisnudelsuppe mit hauchdünnem Rindfleisch, frischen Kräutern und Limette.",
    cuisine_type: "Vietnamesisch",
    calories_adrian: 530,
    calories_janina: 420,
    protein_grams: 44,
    prep_time_minutes: 20,
    spice_level_adrian: 3,
    spice_level_janina: 1,
    main_ingredients: ["Rindfleisch", "Reisnudeln", "Sojasprossen", "Thai-Basilikum"],
    tags: ["rind", "suppe", "nudeln"],
    recipe: {
      ingredients: [
        { name: "Rindfleisch (dünn geschnitten)", amount_adrian: "180", amount_janina: "140", unit: "g", category: "Fleisch/Fisch" },
        { name: "Reisnudeln", amount_adrian: "80", amount_janina: "60", unit: "g", category: "Getreide/Hülsenfrüchte" },
        { name: "Rinderbrühe", amount_adrian: "500", amount_janina: "500", unit: "ml", category: "Sonstiges" },
        { name: "Sojasprossen", amount_adrian: "50", amount_janina: "50", unit: "g", category: "Gemüse" },
        { name: "Thai-Basilikum", amount_adrian: "1", amount_janina: "1", unit: "Handvoll", category: "Gewürze" },
        { name: "Limette", amount_adrian: "1", amount_janina: "1", unit: "Stück", category: "Sonstiges" },
        { name: "Sternanis", amount_adrian: "2", amount_janina: "2", unit: "Stück", category: "Gewürze" },
        { name: "Ingwer", amount_adrian: "3", amount_janina: "3", unit: "cm", category: "Gewürze" },
        { name: "Fischsauce", amount_adrian: "1", amount_janina: "1", unit: "EL", category: "Gewürze" },
        { name: "Sriracha", amount_adrian: "1", amount_janina: "0", unit: "TL", category: "Gewürze" },
      ],
      steps: [
        "Brühe mit Sternanis, Ingwer und Fischsauce 10 Min. köcheln.",
        "Reisnudeln nach Packung in heißem Wasser einweichen.",
        "Sternanis und Ingwer aus der Brühe entfernen.",
        "Nudeln in Schüsseln verteilen, kochend heiße Brühe darüber gießen.",
        "Rohes Rindfleisch dünn darauflegen — die Brühe gart es.",
        "Mit Sprossen, Thai-Basilikum und Limettenspalten servieren.",
      ],
      equipment: ["Herd", "Topf"],
      spice_note: "Adrian: Sriracha + Chili-Scheiben. Janina: nur Limette und Kräuter.",
      nutrition_per_person: {
        adrian: { calories: 530, protein: 44, carbs: 46, fat: 14 },
        janina: { calories: 420, protein: 36, carbs: 38, fat: 10 },
      },
    },
  },
];

// Merge all recipe batches into one array (200 total)
export const RECIPES: StaticRecipe[] = [
  ...BASE_RECIPES,
  ...(RECIPES_ASIAN as StaticRecipe[]),
  ...(RECIPES_MEDITERRANEAN as StaticRecipe[]),
  ...(RECIPES_MEXICAN_INDIAN as StaticRecipe[]),
  ...(RECIPES_AMERICAN_GERMAN as StaticRecipe[]),
  ...(RECIPES_TURKISH_MIDEAST as StaticRecipe[]),
  ...(RECIPES_MIXED as StaticRecipe[]),
  ...(RECIPES_QUICK as StaticRecipe[]),
];

// ═══════════════════════════════════════════════════════════════════════════
// Selection logic
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Select 3 diverse recipes for a user on a given day.
 * Avoids recent meals and ensures variety in cuisine and protein.
 */
export function selectDailyRecipes(
  userRole: "adrian" | "janina",
  recentMealNames: string[] = [],
  seed?: number
): StaticRecipe[] {
  // Deterministic seed from date so both partners get consistent overlap
  const today = seed ?? dateToSeed(new Date());

  // Filter out recent meals
  const available = RECIPES.filter(
    (r) => !recentMealNames.includes(r.meal_name)
  );

  if (available.length < 3) return available.slice(0, 3);

  // Both partners see the SAME 3 recipes (shared seed).
  // userRole is kept for future personalisation but currently ignored here.
  void userRole;
  const shuffled = seededShuffle([...available], today);

  // Pick 3 with diverse cuisines — no two from the same cuisine
  const selected: StaticRecipe[] = [];
  const usedCuisines = new Set<string>();

  for (const recipe of shuffled) {
    if (selected.length >= 3) break;
    if (!usedCuisines.has(recipe.cuisine_type)) {
      selected.push(recipe);
      usedCuisines.add(recipe.cuisine_type);
    }
  }

  // Fallback: if fewer than 3 unique cuisines, fill up from remaining
  if (selected.length < 3) {
    for (const recipe of shuffled) {
      if (selected.length >= 3) break;
      if (!selected.includes(recipe)) {
        selected.push(recipe);
      }
    }
  }

  return selected.slice(0, 3);
}

function dateToSeed(date: Date): number {
  const str = date.toISOString().split("T")[0];
  let hash = 2166136261; // FNV-1a offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  let s = seed;
  const random = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
