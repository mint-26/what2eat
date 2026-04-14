/**
 * Curated Unsplash food photos. Matching hierarchy:
 *   1. Dish-type keyword (bowl, salat, suppe, curry, ...) — most specific
 *   2. Main protein (lachs, garnelen, rind, ...)
 *   3. Cuisine type
 *   4. Generic fallback
 *
 * Each recipe maps deterministically to one image via its id,
 * so the same recipe always shows the same photo.
 */

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&q=80&auto=format`;

// ── Dish-type specific (matches by keyword in tags OR meal_name) ────────────
const IMAGES_BY_DISH: Record<string, string[]> = {
  salat: [
    "photo-1540189549336-e6e99c3679fe",
    "photo-1512621776951-a57141f2eefd",
    "photo-1546793665-c74683f339c1",
    "photo-1607532941433-304659e8198a",
  ],
  bowl: [
    "photo-1546069901-ba9599a7e63c",
    "photo-1603133872878-684f208fb84b",
    "photo-1551504734-5ee1c4a1479b",
    "photo-1563379091339-03b21ab4a4f8",
  ],
  suppe: [
    "photo-1569718212165-3a8278d5f624",
    "photo-1552611052-33e04de081de",
    "photo-1547592180-85f173990554",
    "photo-1579871494447-9811cf80d66c",
  ],
  curry: [
    "photo-1585937421612-70a008356fbe",
    "photo-1565557623262-b51c2513a641",
    "photo-1631292784640-2b24be784d5d",
    "photo-1590301157890-4810ed352733",
  ],
  burger: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1550547660-d9450f859349",
    "photo-1586190848861-99aa4a171e90",
  ],
  steak: [
    "photo-1432139509613-5c4255815697",
    "photo-1558030006-450675393462",
    "photo-1529193591184-b1d58069ecdd",
  ],
  pasta: [
    "photo-1565299624946-b28f40a0ae38",
    "photo-1551183053-bf91a1d81141",
    "photo-1621996346565-e3dbc646d9a9",
  ],
  nudeln: [
    "photo-1617196034796-73dfa7b1fd56",
    "photo-1552611052-33e04de081de",
    "photo-1569058242253-92a9c755a0ec",
  ],
  wok: [
    "photo-1559314809-0d155014e29e",
    "photo-1617093727343-374698b1b08d",
    "photo-1617196034796-73dfa7b1fd56",
  ],
  "stir-fry": [
    "photo-1559314809-0d155014e29e",
    "photo-1617093727343-374698b1b08d",
  ],
  grill: [
    "photo-1544025162-d76694265947",
    "photo-1558030006-450675393462",
    "photo-1594212699903-ec8a3eca50f5",
  ],
  ofen: [
    "photo-1504674900247-0877df9cc836",
    "photo-1607532941433-304659e8198a",
  ],
  auflauf: [
    "photo-1574484284002-952d92456975",
    "photo-1621996346565-e3dbc646d9a9",
    "photo-1551782450-a2132b4ba21d",
  ],
  überbacken: [
    "photo-1574484284002-952d92456975",
    "photo-1621996346565-e3dbc646d9a9",
  ],
  gratin: [
    "photo-1574484284002-952d92456975",
    "photo-1621996346565-e3dbc646d9a9",
  ],
  kartoffel: [
    "photo-1574484284002-952d92456975",
    "photo-1568600891621-50f697b9a1c7",
  ],
  keema: [
    "photo-1585937421612-70a008356fbe",
    "photo-1631292784640-2b24be784d5d",
  ],
  biryani: [
    "photo-1589302168068-964664d93dc0",
  ],
  masala: [
    "photo-1631292784640-2b24be784d5d",
    "photo-1585937421612-70a008356fbe",
  ],
  dal: [
    "photo-1567188040759-fb8a883dc6d8",
  ],
  risotto: [
    "photo-1476124369491-e7addf5db371",
  ],
  eintopf: [
    "photo-1547592180-85f173990554",
    "photo-1569718212165-3a8278d5f624",
  ],
  fajita: [
    "photo-1613514785940-daed07799d9b",
    "photo-1600891964092-4316c288032e",
  ],
  enchilada: [
    "photo-1615870216519-2f9fa575fa5c",
  ],
  burrito: [
    "photo-1551504734-5ee1c4a1479b",
    "photo-1626700051175-6818013e1d4f",
  ],
  quesadilla: [
    "photo-1626700051175-6818013e1d4f",
  ],
  wrap: [
    "photo-1626700051175-6818013e1d4f",
    "photo-1626700051175-6818013e1d4f",
  ],
  tacos: [
    "photo-1565299585323-38d6b0865b47",
    "photo-1615870216519-2f9fa575fa5c",
  ],
  pizza: [
    "photo-1565299624946-b28f40a0ae38",
    "photo-1513104890138-7c749659a591",
  ],
  reis: [
    "photo-1603133872878-684f208fb84b",
    "photo-1589302168068-964664d93dc0",
    "photo-1563379091339-03b21ab4a4f8",
  ],
  poke: [
    "photo-1603133872878-684f208fb84b",
    "photo-1546069901-ba9599a7e63c",
  ],
  kebab: [
    "photo-1599487488170-d11ec9c172f0",
    "photo-1530469912745-a215c6b256ea",
  ],
  köfte: [
    "photo-1599487488170-d11ec9c172f0",
    "photo-1559847844-5315695dadae",
  ],
  köftes: [
    "photo-1599487488170-d11ec9c172f0",
  ],
  schnitzel: [
    "photo-1598103442097-8b74394b95c6",
    "photo-1504674900247-0877df9cc836",
  ],
  frikadellen: [
    "photo-1559847844-5315695dadae",
  ],
  shakshuka: [
    "photo-1608032077018-c9aad9565d29",
  ],
  omelett: [
    "photo-1608032077018-c9aad9565d29",
    "photo-1525351484163-7529414344d8",
  ],
};

// ── Protein specific ────────────────────────────────────────────────────────
const IMAGES_BY_PROTEIN: Record<string, string[]> = {
  lachs: [
    "photo-1485921325833-c519f76c4927",
    "photo-1519708227418-c8fd9a32b7a2",
    "photo-1467003909585-2f8a72700288",
  ],
  thunfisch: [
    "photo-1512058564366-18510be2db19",
    "photo-1579871494447-9811cf80d66c",
  ],
  garnelen: [
    "photo-1565299624946-b28f40a0ae38",
    "photo-1559314809-0d155014e29e",
    "photo-1569058242253-92a9c755a0ec",
  ],
  fisch: [
    "photo-1485921325833-c519f76c4927",
    "photo-1467003909585-2f8a72700288",
  ],
  tofu: [
    "photo-1546069901-ba9599a7e63c",
    "photo-1512621776951-a57141f2eefd",
  ],
  linsen: [
    "photo-1567188040759-fb8a883dc6d8",
    "photo-1565557623262-b51c2513a641",
  ],
  kichererbsen: [
    "photo-1550507992-eb63ffee0847",
    "photo-1540189549336-e6e99c3679fe",
  ],
  ei: [
    "photo-1608032077018-c9aad9565d29",
    "photo-1525351484163-7529414344d8",
  ],
  eier: [
    "photo-1608032077018-c9aad9565d29",
  ],
};

// ── Cuisine specific (final fallback before generic) ───────────────────────
const IMAGES_BY_CUISINE: Record<string, string[]> = {
  Asiatisch: [
    "photo-1569718212165-3a8278d5f624",
    "photo-1617196034796-73dfa7b1fd56",
    "photo-1559314809-0d155014e29e",
    "photo-1603133872878-684f208fb84b",
  ],
  Mediterran: [
    "photo-1551248429-40975aa4de74",
    "photo-1540189549336-e6e99c3679fe",
    "photo-1504674900247-0877df9cc836",
  ],
  Mexikanisch: [
    "photo-1565299585323-38d6b0865b47",
    "photo-1551504734-5ee1c4a1479b",
    "photo-1615870216519-2f9fa575fa5c",
  ],
  Indisch: [
    "photo-1585937421612-70a008356fbe",
    "photo-1565557623262-b51c2513a641",
    "photo-1589302168068-964664d93dc0",
  ],
  Amerikanisch: [
    "photo-1568901346375-23c9450c58cd",
    "photo-1432139509613-5c4255815697",
    "photo-1594212699903-ec8a3eca50f5",
  ],
  Deutsch: [
    "photo-1598103442097-8b74394b95c6",
    "photo-1559847844-5315695dadae",
    "photo-1607532941433-304659e8198a",
  ],
  Türkisch: [
    "photo-1599487488170-d11ec9c172f0",
    "photo-1530469912745-a215c6b256ea",
    "photo-1574894709920-11b28e7367e3",
  ],
  Orientalisch: [
    "photo-1550507992-eb63ffee0847",
    "photo-1540189549336-e6e99c3679fe",
    "photo-1608032077018-c9aad9565d29",
  ],
  Vietnamesisch: [
    "photo-1552611052-33e04de081de",
    "photo-1583224994076-ae7a637f2337",
    "photo-1569058242253-92a9c755a0ec",
  ],
  Koreanisch: [
    "photo-1498654896293-37aacf113fd9",
    "photo-1583224964978-2257b960c3d3",
    "photo-1635363638580-c2809d049eee",
  ],
  Japanisch: [
    "photo-1579871494447-9811cf80d66c",
    "photo-1512058564366-18510be2db19",
    "photo-1569718212165-3a8278d5f624",
  ],
  Chinesisch: [
    "photo-1559314809-0d155014e29e",
    "photo-1617093727343-374698b1b08d",
  ],
  Thai: [
    "photo-1559314809-0d155014e29e",
    "photo-1569562211093-4ed0d0758f12",
    "photo-1590301157890-4810ed352733",
  ],
  Italienisch: [
    "photo-1565299624946-b28f40a0ae38",
    "photo-1551183053-bf91a1d81141",
  ],
  Hawaiianisch: [
    "photo-1603133872878-684f208fb84b",
    "photo-1546069901-ba9599a7e63c",
  ],
  Lateinamerikanisch: [
    "photo-1515443961218-a51367888e4b",
    "photo-1551504734-5ee1c4a1479b",
  ],
  Skandinavisch: [
    "photo-1485921325833-c519f76c4927",
    "photo-1467003909585-2f8a72700288",
  ],
};

const FALLBACKS = [
  "photo-1504674900247-0877df9cc836",
  "photo-1546069901-ba9599a7e63c",
  "photo-1540189549336-e6e99c3679fe",
  "photo-1512621776951-a57141f2eefd",
];

// Order matters: more specific dish-types first
const DISH_KEYWORDS = [
  "shakshuka",
  "schnitzel",
  "frikadellen",
  "auflauf",
  "überbacken",
  "überbackene",
  "gratin",
  "kartoffel",
  "biryani",
  "keema",
  "masala",
  "risotto",
  "eintopf",
  "fajita",
  "fajitas",
  "enchilada",
  "enchiladas",
  "burrito",
  "quesadilla",
  "köfte",
  "köftes",
  "kebab",
  "tacos",
  "burger",
  "pizza",
  "poke",
  "wrap",
  "curry",
  "salat",
  "suppe",
  "pasta",
  "nudeln",
  "stir-fry",
  "wok",
  "bowl",
  "steak",
  "grill",
  "ofen",
  "reis",
  "dal",
  "omelett",
];

const PROTEIN_KEYWORDS = [
  "lachs",
  "thunfisch",
  "garnelen",
  "tofu",
  "linsen",
  "kichererbsen",
  "eier",
  "fisch",
];

export function getRecipeImage(recipe: {
  id: number;
  cuisine_type: string;
  meal_name: string;
  tags?: string[];
}): string {
  const haystack = (
    recipe.meal_name +
    " " +
    (recipe.tags ?? []).join(" ")
  ).toLowerCase();

  // Split haystack into word-ish tokens so "ei" doesn't match "fleisch"
  const tokens = new Set(
    haystack
      .split(/[^a-zäöüß-]+/)
      .flatMap((t) => [t, ...t.split("-")])
      .filter(Boolean)
  );

  const matches = (kw: string) => {
    // Multi-word keyword (e.g. "stir-fry"): substring match on haystack
    if (kw.includes("-") || kw.includes(" ")) return haystack.includes(kw);
    // Single word: require exact token match
    return tokens.has(kw);
  };

  // 1. Try dish-type match (most specific)
  for (const kw of DISH_KEYWORDS) {
    if (matches(kw)) {
      const pool = IMAGES_BY_DISH[kw];
      if (pool) return UNSPLASH(pool[recipe.id % pool.length]);
    }
  }

  // 2. Try protein match
  for (const kw of PROTEIN_KEYWORDS) {
    if (matches(kw)) {
      const pool = IMAGES_BY_PROTEIN[kw];
      if (pool) return UNSPLASH(pool[recipe.id % pool.length]);
    }
  }

  // 3. Cuisine fallback
  const cuisinePool = IMAGES_BY_CUISINE[recipe.cuisine_type];
  if (cuisinePool) {
    return UNSPLASH(cuisinePool[recipe.id % cuisinePool.length]);
  }

  // 4. Generic fallback
  return UNSPLASH(FALLBACKS[recipe.id % FALLBACKS.length]);
}
