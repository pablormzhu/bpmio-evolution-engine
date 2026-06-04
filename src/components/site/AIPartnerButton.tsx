import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function AIPartnerButton() {
  return (
    <Link
      to="/ai-partner"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary py-3 pl-4 pr-5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-1"
      aria-label="Abrir AI Partner"
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[oklch(0.78_0.12_162)] text-primary">
        <Sparkles size={14} />
        <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.78_0.12_162)] opacity-40" />
      </span>
      <span className="hidden sm:inline">AI Partner</span>
      <span className="sm:hidden">AI</span>
    </Link>
  );
}
