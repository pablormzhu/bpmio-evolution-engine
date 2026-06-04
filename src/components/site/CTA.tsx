import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { CalendlyTrigger } from "./CalendlyPopup";

export function PrimaryCTA({ children = "Agenda una llamada" }: { children?: React.ReactNode }) {
  return (
    <CalendlyTrigger className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5">
      {children}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </CalendlyTrigger>
  );
}

export function MintCTA({ children = "Hazte tu Check Up Digital" }: { children?: React.ReactNode }) {
  return (
    <Link
      to="/ai-partner"
      className="group inline-flex items-center gap-2 rounded-full bg-[oklch(0.78_0.12_162)] px-6 py-3.5 text-sm font-semibold text-[oklch(0.28_0.07_168)] shadow-soft transition-transform hover:-translate-y-0.5"
    >
      <Sparkles size={16} />
      {children}
    </Link>
  );
}
