import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AIPartnerButton } from "./AIPartnerButton";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-mint" aria-hidden />
      <Header />
      <main>{children}</main>
      <Footer />
      <AIPartnerButton />
    </div>
  );
}
