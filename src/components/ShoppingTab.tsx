"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { ShoppingItem } from "@/types/database";
import { saveShoppingList } from "@/lib/db";

const CATEGORY_ORDER = [
  "Fleisch/Fisch",
  "Gemüse",
  "Milchprodukte",
  "Getreide/Hülsenfrüchte",
  "Gewürze",
  "Sonstiges",
];

const CATEGORY_ICONS: Record<string, string> = {
  "Fleisch/Fisch": "🥩",
  "Gemüse": "🥦",
  "Milchprodukte": "🥛",
  "Getreide/Hülsenfrüchte": "🌾",
  "Gewürze": "🫙",
  "Sonstiges": "🛒",
};

export function ShoppingTab({
  items: initialItems,
  date,
  mealName,
}: {
  items: ShoppingItem[];
  date: string;
  mealName?: string | null;
}) {
  const [items, setItems] = useState<ShoppingItem[]>(initialItems);

  // Sync when parent updates (e.g., after match result)
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function toggle(index: number) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setItems(updated);
    saveShoppingList(date, updated);
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function clearChecked() {
    const updated = items.map((item) => ({ ...item, checked: false }));
    setItems(updated);
    saveShoppingList(date, updated);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
        <span className="text-5xl mb-4 block">🛒</span>
        <p className="text-text-secondary mb-1">Keine Einkaufsliste</p>
        <p className="text-text-muted text-sm">
          Nach eurem Match erscheinen hier die Zutaten
        </p>
      </div>
    );
  }

  // Group by category
  const grouped: Record<string, { item: ShoppingItem; index: number }[]> = {};
  items.forEach((item, index) => {
    const cat = item.category || "Sonstiges";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push({ item, index });
  });

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) =>
      (CATEGORY_ORDER.indexOf(a) === -1 ? 99 : CATEGORY_ORDER.indexOf(a)) -
      (CATEGORY_ORDER.indexOf(b) === -1 ? 99 : CATEGORY_ORDER.indexOf(b))
  );

  const checkedCount = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? checkedCount / items.length : 0;

  return (
    <div className="px-5 pt-4 pb-6">
      {/* Header */}
      {mealName && (
        <div className="mb-4">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Für heute</p>
          <h2 className="font-display text-lg font-semibold text-text-primary">{mealName}</h2>
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>{checkedCount} von {items.length} erledigt</span>
          {checkedCount > 0 && (
            <button onClick={clearChecked} className="text-accent-gold">
              Zurücksetzen
            </button>
          )}
        </div>
        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-green rounded-full"
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-5">
        {sortedCategories.map((cat) => (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{CATEGORY_ICONS[cat] ?? "📦"}</span>
              <span className="text-xs text-text-muted uppercase tracking-wider">{cat}</span>
            </div>

            <div className="space-y-2">
              {grouped[cat].map(({ item, index }) => (
                <motion.button
                  key={`${item.name}-${index}`}
                  onClick={() => toggle(index)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    item.checked ? "bg-bg-elevated opacity-50" : "bg-bg-card"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      item.checked
                        ? "border-accent-green bg-accent-green"
                        : "border-white/20"
                    }`}
                  >
                    {item.checked && (
                      <span className="text-bg-primary text-xs font-bold">✓</span>
                    )}
                  </span>

                  <span
                    className={`flex-1 text-sm transition-colors ${
                      item.checked
                        ? "line-through text-text-muted"
                        : "text-text-primary"
                    }`}
                  >
                    {item.name}
                  </span>

                  <span className="text-xs text-text-muted shrink-0 text-right max-w-[90px] leading-tight">
                    {item.amount}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {checkedCount === items.length && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <span className="text-3xl block mb-2">✅</span>
          <p className="text-accent-green font-medium text-sm">Alles eingekauft!</p>
        </motion.div>
      )}
    </div>
  );
}
