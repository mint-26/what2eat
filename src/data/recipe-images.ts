/**
 * Curated Unsplash food photos, grouped by cuisine type.
 * Each recipe deterministically maps to one image based on its id,
 * so the same recipe always shows the same photo.
 *
 * All URLs use Unsplash's image CDN with query params for size/quality.
 */

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&h=600&fit=crop&q=80&auto=format`;

// Curated photo IDs from unsplash.com (all food photography, CC0 license)
const IMAGES_BY_CUISINE: Record<string, string[]> = {
  Asiatisch: [
    "photo-1569718212165-3a8278d5f624", // ramen bowl
    "photo-1617196034796-73dfa7b1fd56", // asian noodles
    "photo-1512058564366-18510be2db19", // sushi
    "photo-1603133872878-684f208fb84b", // poke bowl
    "photo-1590301157890-4810ed352733", // thai curry
    "photo-1559314809-0d155014e29e", // stir fry
    "photo-1563379091339-03b21ab4a4f8", // bibimbap
    "photo-1552611052-33e04de081de", // pho
  ],
  Mediterran: [
    "photo-1551248429-40975aa4de74", // mediterranean plate
    "photo-1540189549336-e6e99c3679fe", // salad
    "photo-1574894709920-11b28e7367e3", // greek gyros
    "photo-1544025162-d76694265947", // grilled meat
    "photo-1565299624946-b28f40a0ae38", // pizza/flatbread
    "photo-1608032077018-c9aad9565d29", // shakshuka
    "photo-1512621776951-a57141f2eefd", // veggie bowl
    "photo-1504674900247-0877df9cc836", // plated dinner
  ],
  Mexikanisch: [
    "photo-1565299585323-38d6b0865b47", // tacos
    "photo-1551504734-5ee1c4a1479b", // burrito bowl
    "photo-1600891964092-4316c288032e", // mexican food
    "photo-1615870216519-2f9fa575fa5c", // enchiladas
    "photo-1613514785940-daed07799d9b", // fajitas
    "photo-1626700051175-6818013e1d4f", // quesadilla
  ],
  Indisch: [
    "photo-1585937421612-70a008356fbe", // butter chicken
    "photo-1565557623262-b51c2513a641", // indian curry
    "photo-1589302168068-964664d93dc0", // biryani
    "photo-1606491956689-2ea866880c84", // tandoori
    "photo-1567188040759-fb8a883dc6d8", // dal
    "photo-1631292784640-2b24be784d5d", // tikka masala
  ],
  Amerikanisch: [
    "photo-1568901346375-23c9450c58cd", // burger
    "photo-1546069901-ba9599a7e63c", // bowl
    "photo-1529193591184-b1d58069ecdd", // bbq
    "photo-1594212699903-ec8a3eca50f5", // grilled chicken
    "photo-1598515214211-89d3c73ae83b", // american plate
    "photo-1432139509613-5c4255815697", // steak
  ],
  Deutsch: [
    "photo-1544025162-d76694265947", // grilled meat
    "photo-1504674900247-0877df9cc836", // plated food
    "photo-1598103442097-8b74394b95c6", // schnitzel style
    "photo-1559847844-5315695dadae", // meatballs
    "photo-1607532941433-304659e8198a", // potato dish
  ],
  Türkisch: [
    "photo-1599487488170-d11ec9c172f0", // kebab
    "photo-1529193591184-b1d58069ecdd", // grilled meat
    "photo-1530469912745-a215c6b256ea", // mediterranean platter
    "photo-1574894709920-11b28e7367e3", // gyros
    "photo-1544025162-d76694265947", // grilled
  ],
  Orientalisch: [
    "photo-1540189549336-e6e99c3679fe", // middle eastern
    "photo-1550507992-eb63ffee0847", // hummus bowl
    "photo-1601050690597-df0568f70950", // shawarma
    "photo-1608032077018-c9aad9565d29", // shakshuka
    "photo-1530469912745-a215c6b256ea", // platter
  ],
  Vietnamesisch: [
    "photo-1552611052-33e04de081de", // pho
    "photo-1583224994076-ae7a637f2337", // banh mi
    "photo-1617196034796-73dfa7b1fd56", // noodles
    "photo-1569058242253-92a9c755a0ec", // vietnamese spring rolls
  ],
  Koreanisch: [
    "photo-1498654896293-37aacf113fd9", // korean food
    "photo-1583224964978-2257b960c3d3", // bibimbap
    "photo-1590301157890-4810ed352733", // korean stew
    "photo-1635363638580-c2809d049eee", // korean bbq
  ],
  Hawaiianisch: [
    "photo-1603133872878-684f208fb84b", // poke bowl
    "photo-1546069901-ba9599a7e63c", // bowl
    "photo-1563379091339-03b21ab4a4f8", // tropical bowl
  ],
  Lateinamerikanisch: [
    "photo-1515443961218-a51367888e4b", // ceviche
    "photo-1551504734-5ee1c4a1479b", // burrito bowl
    "photo-1600891964092-4316c288032e", // latin food
  ],
  Skandinavisch: [
    "photo-1485921325833-c519f76c4927", // salmon
    "photo-1467003909585-2f8a72700288", // nordic plate
    "photo-1504674900247-0877df9cc836", // clean plate
  ],
  Japanisch: [
    "photo-1579871494447-9811cf80d66c", // ramen
    "photo-1512058564366-18510be2db19", // sushi
    "photo-1569718212165-3a8278d5f624", // donburi
  ],
  Chinesisch: [
    "photo-1559314809-0d155014e29e", // stir fry
    "photo-1617093727343-374698b1b08d", // chinese food
  ],
  Thai: [
    "photo-1559314809-0d155014e29e", // thai stir fry
    "photo-1569562211093-4ed0d0758f12", // thai curry
  ],
  Italienisch: [
    "photo-1565299624946-b28f40a0ae38", // pasta
    "photo-1551183053-bf91a1d81141", // italian plate
  ],
};

// Generic food photo fallbacks for any cuisine
const FALLBACKS = [
  "photo-1504674900247-0877df9cc836",
  "photo-1546069901-ba9599a7e63c",
  "photo-1540189549336-e6e99c3679fe",
  "photo-1512621776951-a57141f2eefd",
];

export function getRecipeImage(recipe: {
  id: number;
  cuisine_type: string;
}): string {
  const pool =
    IMAGES_BY_CUISINE[recipe.cuisine_type] ??
    FALLBACKS;
  const photoId = pool[recipe.id % pool.length];
  return UNSPLASH(photoId);
}
