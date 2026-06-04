import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`} aria-label="BPM.io inicio">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M10 4 C10 4, 22 6, 22 16 C22 26, 10 28, 10 28 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          className="text-[oklch(0.55_0.13_162)]"
        />
        <circle cx="22" cy="16" r="2.4" className="fill-[oklch(0.55_0.13_162)]" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight text-primary">
        BPM<span className="text-[oklch(0.55_0.13_162)]">.io</span>
      </span>
    </Link>
  );
}
