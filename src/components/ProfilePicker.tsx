"use client";

import { motion } from "framer-motion";
import type { UserRole } from "@/types/database";
import { LogoIcon } from "./Logo";

const profiles = [
  {
    role: "adrian" as UserRole,
    name: "Adrian",
    emoji: "👨‍🍳",
    gradient: "from-accent-red/20 to-accent-terracotta/10",
    border: "border-accent-red/30",
    accent: "text-accent-red",
  },
  {
    role: "janina" as UserRole,
    name: "Janina",
    emoji: "👩‍🍳",
    gradient: "from-accent-gold/20 to-accent-green/10",
    border: "border-accent-gold/30",
    accent: "text-accent-gold",
  },
];

export function ProfilePicker({ onSelect }: { onSelect: (role: UserRole) => void }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 safe-top safe-bottom bg-bg-primary">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-4"
      >
        <LogoIcon size={80} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl tracking-wide mb-1"
      >
        <span className="font-light text-text-secondary">what</span>
        <span className="font-display font-bold text-accent-red text-[1.3em] leading-none">2</span>
        <span className="font-light text-text-secondary">eat</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-text-muted text-sm tracking-widest uppercase mb-12"
      >
        Was kochen wir heute?
      </motion.p>

      {/* Profile Cards */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {profiles.map((profile, i) => (
          <motion.button
            key={profile.role}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: "easeOut" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(profile.role)}
            className={`
              relative w-full rounded-2xl border ${profile.border}
              bg-gradient-to-br ${profile.gradient}
              backdrop-blur-sm p-6 flex items-center gap-5
              active:brightness-110 transition-all
            `}
          >
            <span className="text-5xl">{profile.emoji}</span>
            <div className="text-left">
              <span className={`text-2xl font-display font-semibold ${profile.accent}`}>
                {profile.name}
              </span>
              <p className="text-text-muted text-sm mt-0.5">Tippe um einzuloggen</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
