import { Link } from "@tanstack/react-router";
import bpmLogo from "@/assets/bpm-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center ${className}`} aria-label="BPM.io inicio">
      <img
        src={bpmLogo.url}
        alt="BPM.io"
        className="h-8 w-auto md:h-9"
        loading="eager"
        decoding="async"
      />
    </Link>
  );
}
