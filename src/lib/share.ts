import type { RecipeJSON, UserRole } from "@/types/database";

export async function shareRecipe(
  mealName: string,
  recipe: RecipeJSON,
  currentUser: UserRole
) {
  const nutrition = recipe.nutrition_per_person[currentUser];
  const ingredients = recipe.ingredients
    .map((i) => {
      const amount = currentUser === "adrian" ? i.amount_adrian : i.amount_janina;
      return `- ${i.name}: ${amount} ${i.unit}`;
    })
    .join("\n");

  const steps = recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");

  const text = `🍽️ ${mealName}
⏱️ ${recipe.equipment.join(", ")} | 🔥 ${nutrition.calories} kcal | 💪 ${nutrition.protein}g Protein

Zutaten:
${ingredients}

Zubereitung:
${steps}

Gekocht mit what2eat ❤️`;

  if (navigator.share) {
    try {
      await navigator.share({ title: mealName, text });
      return;
    } catch {
      // User cancelled or share failed
    }
  }

  // Fallback: copy to clipboard
  await navigator.clipboard.writeText(text);
  return "copied";
}

export async function shareShoppingList(items: { name: string; amount: string; unit: string; category: string }[]) {
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const text = Object.entries(grouped)
    .map(
      ([cat, catItems]) =>
        `📦 ${cat}\n${catItems.map((i) => `  ☐ ${i.name}: ${i.amount} ${i.unit}`).join("\n")}`
    )
    .join("\n\n");

  const fullText = `🛒 Einkaufsliste\n\n${text}\n\nErstellt mit what2eat ❤️`;

  if (navigator.share) {
    try {
      await navigator.share({ title: "Einkaufsliste", text: fullText });
      return;
    } catch {}
  }
  await navigator.clipboard.writeText(fullText);
  return "copied";
}
