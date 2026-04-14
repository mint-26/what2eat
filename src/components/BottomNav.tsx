"use client";

import { motion } from "framer-motion";

type Tab = "heute" | "woche" | "einkauf" | "history";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "heute", label: "Heute", icon: "🍽️" },
  { id: "woche", label: "Woche", icon: "📅" },
  { id: "einkauf", label: "Einkauf", icon: "🛒" },
  { id: "history", label: "History", icon: "📖" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-secondary/90 backdrop-blur-xl border-t border-white/5 safe-bottom">
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              <span className={`text-lg ${isActive ? "" : "grayscale opacity-50"}`}>
                {tab.icon}
              </span>
              <span
                className={`text-[10px] mt-0.5 ${
                  isActive ? "text-accent-gold font-medium" : "text-text-muted"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute -top-px left-3 right-3 h-0.5 bg-accent-gold rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
