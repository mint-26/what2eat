"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { ShoppingItem, UserRole } from "@/types/database";
import { saveShoppingList, buildShoppingList, getTodaysMatch, getShoppingList } from "@/lib/db";
import {
  LOCATIONS,
  getLocation,
  setLocation,
  type LocationKey,
} from "@/lib/packaging";

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

const STORE_COLORS: Record<string, string> = {
  Aldi: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  Lidl: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Rewe: "bg-red-500/20 text-red-300 border-red-500/30",
  Edeka: "bg-amber-500/20 text-amber-200 border-amber-500/30",
};

type GroupMode = "category" | "store";

export function ShoppingTab({
  items: initialItems,
  date,
  mealName,
  currentUser,
}: {
  items: ShoppingItem[];
  date: string;
  mealName?: string | null;
  currentUser: UserRole;
}) {
  // Authoritative read from localStorage on mount; fall back to prop seed.
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    if (typeof window === "undefined") return initialItems;
    const saved = getShoppingList(date);
    return saved.length > 0 ? saved : initialItems;
  });
  const [location, setLoc] = useState<LocationKey | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>("store");

  // Hydrate location from localStorage
  useEffect(() => {
    setLoc(getLocation());
  }, []);

  // If parent seeds a list we don't have yet (first match today), adopt it.
  useEffect(() => {
    if (items.length === 0 && initialItems.length > 0) {
      setItems(initialItems);
    }
  }, [initialItems, items.length]);

  // When location is picked, rebuild items with store assignments
  function pickLocation(key: LocationKey) {
    setLocation(key);
    setLoc(key);
    // Rebuild list with store info from current match
    const match = getTodaysMatch(date);
    if (match?.matched_recipe_json) {
      const rebuilt = buildShoppingList(match.matched_recipe_json, key).map((newItem) => {
        // Preserve checked state from existing items
        const prev = items.find((i) => i.name === newItem.name);
        return prev ? { ...newItem, checked: prev.checked } : newItem;
      });
      setItems(rebuilt);
      saveShoppingList(date, rebuilt);
    }
  }

  function toggle(index: number) {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      const willCheck = !item.checked;
      return {
        ...item,
        checked: willCheck,
        checked_by: willCheck ? currentUser : null,
      };
    });
    setItems(updated);
    saveShoppingList(date, updated);
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function clearChecked() {
    const updated = items.map((item) => ({ ...item, checked: false, checked_by: null }));
    setItems(updated);
    saveShoppingList(date, updated);
  }

  const userBadge = (role: UserRole) =>
    role === "adrian" ? { label: "A", cls: "bg-sky-500/30 text-sky-200" } : { label: "J", cls: "bg-pink-500/30 text-pink-200" };

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

  // ── Location picker ────────────────────────────────────────────────────────
  if (!location) {
    return (
      <div className="px-5 pt-6 pb-6">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-text-primary mb-1">
            Wo seid ihr heute?
          </h2>
          <p className="text-sm text-text-muted">
            Damit wir wissen, welche Supermärkte verfügbar sind.
          </p>
        </div>
        <div className="space-y-3">
          {Object.values(LOCATIONS).map((loc) => (
            <motion.button
              key={loc.key}
              whileTap={{ scale: 0.98 }}
              onClick={() => pickLocation(loc.key)}
              className="w-full bg-bg-card hover:bg-bg-elevated rounded-2xl p-4 text-left transition-colors"
            >
              <div className="font-semibold text-text-primary mb-1">{loc.label}</div>
              <div className="flex gap-2 flex-wrap">
                {loc.stores.map((s) => (
                  <span
                    key={s}
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${STORE_COLORS[s]}`}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const locInfo = LOCATIONS[location];

  // ── Grouping ──────────────────────────────────────────────────────────────
  const grouped: Record<string, { item: ShoppingItem; index: number }[]> = {};
  items.forEach((item, index) => {
    const key =
      groupMode === "store"
        ? item.store || "Sonstige"
        : item.category || "Sonstiges";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ item, index });
  });

  const sortedGroups =
    groupMode === "store"
      ? Object.keys(grouped).sort((a, b) => {
          const order = [...locInfo.stores, "Sonstige"];
          return order.indexOf(a) - order.indexOf(b);
        })
      : Object.keys(grouped).sort(
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
        <div className="mb-3">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Für heute</p>
          <h2 className="font-display text-lg font-semibold text-text-primary">{mealName}</h2>
        </div>
      )}

      {/* Location + group mode toggle */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <button
          onClick={() => setLoc(null)}
          className="text-xs text-text-muted flex items-center gap-1.5"
        >
          <span>📍</span>
          <span className="underline decoration-dotted">{locInfo.label}</span>
        </button>
        <div className="flex gap-1 bg-bg-card rounded-full p-0.5">
          <button
            onClick={() => setGroupMode("store")}
            className={`text-[10px] px-3 py-1 rounded-full transition-colors ${
              groupMode === "store" ? "bg-accent-gold text-bg-primary" : "text-text-muted"
            }`}
          >
            Nach Laden
          </button>
          <button
            onClick={() => setGroupMode("category")}
            className={`text-[10px] px-3 py-1 rounded-full transition-colors ${
              groupMode === "category" ? "bg-accent-gold text-bg-primary" : "text-text-muted"
            }`}
          >
            Nach Kategorie
          </button>
        </div>
      </div>

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

      {/* Groups */}
      <div className="space-y-5">
        {sortedGroups.map((grp) => {
          const isStore = groupMode === "store";
          const icon = isStore ? "🛒" : CATEGORY_ICONS[grp] ?? "📦";
          const labelClass = isStore
            ? `text-xs px-2 py-0.5 rounded-full border ${STORE_COLORS[grp] ?? "bg-bg-card text-text-muted border-white/10"}`
            : "text-xs text-text-muted uppercase tracking-wider";

          return (
            <div key={grp}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-base">{icon}</span>
                <span className={labelClass}>{grp}</span>
                <span className="text-[10px] text-text-muted">({grouped[grp].length})</span>
              </div>

              <div className="space-y-2">
                {grouped[grp].map(({ item, index }) => (
                  <motion.button
                    key={`${item.name}-${index}`}
                    onClick={() => toggle(index)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl transition-colors text-left ${
                      item.checked ? "bg-bg-elevated opacity-50" : "bg-bg-card"
                    }`}
                  >
                    {item.checked && item.checked_by ? (
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold ${userBadge(item.checked_by).cls}`}
                        title={item.checked_by === "adrian" ? "Adrian bringt/kauft" : "Janina bringt/kauft"}
                      >
                        {userBadge(item.checked_by).label}
                      </span>
                    ) : (
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          item.checked ? "border-accent-green bg-accent-green" : "border-white/20"
                        }`}
                      >
                        {item.checked && (
                          <span className="text-bg-primary text-xs font-bold">✓</span>
                        )}
                      </span>
                    )}

                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm transition-colors ${
                          item.checked
                            ? "line-through text-text-muted"
                            : "text-text-primary"
                        }`}
                      >
                        {item.name}
                      </div>
                      {item.package_note && (
                        <div className="text-[10px] text-text-muted mt-0.5">
                          {item.package_note}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-xs text-text-primary font-medium">
                        {item.package_size || item.amount}
                      </span>
                      {!isStore && item.store && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full border ${STORE_COLORS[item.store] ?? ""}`}
                        >
                          {item.store}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-text-muted text-center mt-6 px-4 leading-relaxed">
        Laden-Empfehlung basiert auf typischer Preis-Positionierung der Ketten —
        keine Live-Prospekte.
      </p>

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
