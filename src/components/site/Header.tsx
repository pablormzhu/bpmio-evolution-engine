import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { CalendlyTrigger } from "./CalendlyPopup";
import { Menu, X } from "lucide-react";

const nav = [
  { label: "Inicio", to: "/" as const },
  { label: "Servicios", to: "/servicios" as const },
  { label: "Filosofía", to: "/filosofia" as const },
  { label: "AI Partner", to: "/ai-partner" as const },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/75 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-primary"
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-primary bg-secondary" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/"
            hash="contacto"
            className="rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-primary"
          >
            Contacto
          </Link>
        </nav>
        <div className="hidden md:block">
          <CalendlyTrigger className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5">
            Agenda una llamada
          </CalendlyTrigger>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-full p-2 text-primary md:hidden"
          aria-label="Menú"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/"
              hash="contacto"
              className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/80 hover:bg-secondary"
            >
              Contacto
            </Link>
            <Link
              to="/"
              hash="contacto"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Agenda una llamada
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
