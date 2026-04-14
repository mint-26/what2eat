"use client";

export function LogoIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="what2eat"
    >
      <defs>
        <linearGradient id="logo-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c74b3f" />
          <stop offset="100%" stopColor="#c74b3f" />
        </linearGradient>
        <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a843" />
          <stop offset="100%" stopColor="#d4a843" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="24" r="14" fill="none" stroke="url(#logo-red)" strokeWidth="2.2" opacity="0.9" />
      <circle cx="30" cy="24" r="14" fill="none" stroke="url(#logo-gold)" strokeWidth="2.2" opacity="0.9" />
      <ellipse cx="24" cy="24" rx="5" ry="8.5" fill="#c47a5a" opacity="0.2" />
    </svg>
  );
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <LogoIcon size={36} />
      <span className="text-xl tracking-wide">
        <span className="font-light text-text-secondary">what</span>
        <span className="font-display font-bold text-accent-red text-[1.35em] leading-none">2</span>
        <span className="font-light text-text-secondary">eat</span>
      </span>
    </div>
  );
}
