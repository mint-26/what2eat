"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { DailySuggestion, MatchResult, UserRole } from "@/types/database";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

interface DayPlan {
  date: string;
  dayLabel: string;
  suggestions?: DailySuggestion[];
  match?: MatchResult;
  status: "open" | "voting" | "matched";
}

function getWeekDays(startDate: Date): DayPlan[] {
  const days: DayPlan[] = [];
  const start = new Date(startDate);
  // Adjust to Monday
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);

  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d.toISOString().split("T")[0],
      dayLabel: WEEKDAYS[i],
      status: "open",
    });
  }
  return days;
}

function DayCard({ plan, isToday, onTap }: { plan: DayPlan; isToday: boolean; onTap: () => void }) {
  const dateObj = new Date(plan.date + "T00:00:00");
  const dayNum = dateObj.getDate();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className={`
        w-full flex items-center gap-4 p-4 rounded-2xl transition-colors
        ${isToday ? "bg-accent-gold/10 border border-accent-gold/20" : "bg-bg-card"}
      `}
    >
      {/* Day indicator */}
      <div className={`
        shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center
        ${isToday ? "bg-accent-gold text-bg-primary" : "bg-bg-elevated text-text-secondary"}
      `}>
        <span className="text-[10px] font-medium uppercase tracking-wider">{plan.dayLabel}</span>
        <span className="text-lg font-bold leading-tight">{dayNum}</span>
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        {plan.match ? (
          <>
            <p className="text-sm font-medium text-text-primary truncate">
              {plan.match.matched_meal_name}
            </p>
            <p className="text-xs text-accent-green mt-0.5">
              Gematcht — {plan.match.who_cooks === "adrian" ? "Adrian" : "Janina"} kocht
            </p>
          </>
        ) : plan.status === "voting" ? (
          <>
            <p className="text-sm text-text-secondary">Abstimmung läuft...</p>
            <p className="text-xs text-accent-gold mt-0.5">Noch nicht gematcht</p>
          </>
        ) : (
          <>
            <p className="text-sm text-text-muted">Noch nicht geplant</p>
            <p className="text-xs text-text-muted mt-0.5">Tippe zum Planen</p>
          </>
        )}
      </div>

      {/* Status badge */}
      <div className="shrink-0">
        {plan.match ? (
          <span className="w-8 h-8 rounded-full bg-accent-green/20 flex items-center justify-center text-sm">✓</span>
        ) : plan.status === "voting" ? (
          <span className="w-8 h-8 rounded-full bg-accent-gold/20 flex items-center justify-center text-sm">⏳</span>
        ) : (
          <span className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs text-text-muted">+</span>
        )}
      </div>

      {/* Meal thumbnail */}
      {plan.match?.matched_image_url && (
        <img
          src={plan.match.matched_image_url}
          alt=""
          className="shrink-0 w-14 h-14 rounded-xl object-cover"
          loading="lazy"
        />
      )}
    </motion.button>
  );
}

export function WeekPlan({ currentUser }: { currentUser: UserRole }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const days = getWeekDays(baseDate);

  const todayStr = new Date().toISOString().split("T")[0];

  // Week label
  const weekStart = new Date(days[0].date + "T00:00:00");
  const weekEnd = new Date(days[6].date + "T00:00:00");
  const weekLabel = `${weekStart.getDate()}.${weekStart.getMonth() + 1}. – ${weekEnd.getDate()}.${weekEnd.getMonth() + 1}.`;

  return (
    <div className="px-5 pb-24">
      {/* Week selector */}
      <div className="flex items-center justify-between py-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-secondary"
        >
          ←
        </button>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">
            {weekOffset === 0 ? "Diese Woche" : weekOffset === 1 ? "Nächste Woche" : weekLabel}
          </p>
          <p className="text-xs text-text-muted">{weekLabel}</p>
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          className="w-10 h-10 rounded-full bg-bg-card flex items-center justify-center text-text-secondary"
        >
          →
        </button>
      </div>

      {/* Days */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={weekOffset}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {days.map((day) => (
              <DayCard
                key={day.date}
                plan={day}
                isToday={day.date === todayStr}
                onTap={() => {
                  // TODO: Navigate to day's suggestions or trigger generation
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Generate week button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="w-full mt-6 py-4 rounded-2xl bg-accent-gold text-bg-primary font-semibold text-sm"
        onClick={() => {
          // TODO: Generate suggestions for entire week
        }}
      >
        Ganze Woche planen
      </motion.button>
    </div>
  );
}
