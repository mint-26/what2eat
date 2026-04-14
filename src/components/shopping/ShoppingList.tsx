"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { shareShoppingList } from "@/lib/share";
import type { ShoppingItem } from "@/types/database";

const CATEGORY_ICONS: Record<string, string> = {
  "Fleisch/Fisch": "🥩",
  Gemüse: "🥬",
  Milchprodukte: "🥛",
  Gewürze: "🧂",
  "Getreide/Hülsenfrüchte": "🌾",
  Sonstiges: "📦",
};

const CATEGORY_ORDER = ["Fleisch/Fisch", "Gemüse", "Milchprodukte", "Getreide/Hülsenfrüchte", "Gewürze", "Sonstiges"];

function groupByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  const grouped: Record<string, ShoppingItem[]> = {};
  for (const item of items) {
    const cat = item.category || "Sonstiges";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }
  return grouped;
}

function ShoppingItemRow({
  item,
  onToggle,
}: {
  item: ShoppingItem;
  onToggle: () => void;
}) {
  return (
    <motion.button
      layout
      onClick={onToggle}
      className="w-full flex items-center gap-3 py-3 px-1"
    >
      {/* Checkbox */}
      <motion.div
        animate={item.checked ? { scale: [1, 1.2, 1] } : {}}
        className={`
          shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors
          ${item.checked ? "bg-accent-green border-accent-green" : "border-text-muted/30"}
        `}
      >
        {item.checked && <span className="text-bg-primary text-xs font-bold">✓</span>}
      </motion.div>

      {/* Image */}
      {item.image_url ? (
        <img src={item.image_url} alt="" className="w-8 h-8 rounded-full object-cover bg-bg-elevated shrink-0" loading="lazy" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-sm shrink-0">
          {CATEGORY_ICONS[item.category] || "📦"}
        </div>
      )}

      {/* Name + amount */}
      <div className={`flex-1 text-left transition-opacity ${item.checked ? "opacity-40" : ""}`}>
        <span className={`text-sm ${item.checked ? "line-through text-text-muted" : "text-text-primary"}`}>
          {item.name}
        </span>
      </div>

      <span className={`text-xs shrink-0 ${item.checked ? "opacity-40 line-through text-text-muted" : "text-text-secondary"}`}>
        {item.amount} {item.unit}
      </span>
    </motion.button>
  );
}

export function ShoppingList({
  items: initialItems,
}: {
  items: ShoppingItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const [showChecked, setShowChecked] = useState(true);

  const grouped = groupByCategory(items);
  const checkedCount = items.filter((i) => i.checked).length;
  const totalCount = items.length;

  function toggleItem(name: string) {
    setItems((prev) =>
      prev.map((i) => (i.name === name ? { ...i, checked: !i.checked } : i))
    );
    if (navigator.vibrate) navigator.vibrate(30);
  }

  async function handleShare() {
    const unchecked = items.filter((i) => !i.checked);
    const result = await shareShoppingList(unchecked);
    if (result === "copied") {
      // Could show a toast here
    }
  }

  if (totalCount === 0) {
    return (
      <div className="px-5 py-20 text-center">
        <span className="text-5xl block mb-4">🛒</span>
        <p className="text-text-secondary">Noch keine Einkaufsliste</p>
        <p className="text-text-muted text-sm mt-1">
          Matche ein Rezept um eine Liste zu erstellen
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-24">
      {/* Progress */}
      <div className="py-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-text-secondary">
            {checkedCount} von {totalCount} erledigt
          </p>
          <button
            onClick={() => setShowChecked(!showChecked)}
            className="text-xs text-accent-gold"
          >
            {showChecked ? "Erledigte ausblenden" : "Alle anzeigen"}
          </button>
        </div>
        <div className="h-1.5 bg-bg-card rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent-green rounded-full"
            animate={{ width: `${(checkedCount / totalCount) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Categories */}
      {CATEGORY_ORDER.map((category) => {
        const catItems = grouped[category];
        if (!catItems) return null;

        const visibleItems = showChecked
          ? catItems
          : catItems.filter((i) => !i.checked);

        if (visibleItems.length === 0) return null;

        return (
          <div key={category} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">{CATEGORY_ICONS[category] || "📦"}</span>
              <h3 className="text-xs text-text-muted uppercase tracking-wider font-medium">
                {category}
              </h3>
              <span className="text-[10px] text-text-muted bg-bg-card px-1.5 py-0.5 rounded-full">
                {visibleItems.length}
              </span>
            </div>

            <div className="bg-bg-card rounded-xl px-3 divide-y divide-white/5">
              <AnimatePresence>
                {visibleItems.map((item) => (
                  <ShoppingItemRow
                    key={item.name}
                    item={item}
                    onToggle={() => toggleItem(item.name)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {/* Share button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleShare}
        className="w-full py-4 rounded-2xl bg-accent-gold text-bg-primary font-semibold text-sm flex items-center justify-center gap-2"
      >
        Einkaufsliste teilen
      </motion.button>
    </div>
  );
}
