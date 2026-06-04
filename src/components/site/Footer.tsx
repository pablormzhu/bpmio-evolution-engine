import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Mail, Phone, Linkedin, ArrowUpRight, MapPin, Sparkles } from "lucide-react";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/servicios", label: "Servicios" },
  { to: "/filosofia", label: "Filosofía" },
  { to: "/ai-partner", label: "AI Partner" },
];

const contactLinks = [
  { icon: Mail, label: "info@bpmio.com.mx", href: "mailto:info@bpmio.com.mx" },
  { icon: Phone, label: "+52 55 8010 0974", href: "tel:+525580100974" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com", external: true },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-primary text-primary-foreground">
      {/* fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[oklch(0.78_0.12_162)]/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[oklch(0.55_0.13_162)]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.95_0.02_162) 1px, transparent 1px), linear-gradient(90deg, oklch(0.95_0.02_162) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* CTA band superior */}
      <div className="relative border-b border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 lg:flex-row lg:items-center lg:px-10">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.78_0.12_162)]">
              <Sparkles size={14} />
              ¿Listo para evolucionar?
            </p>
            <h3 className="mt-3 max-w-2xl text-balance text-3xl font-extrabold leading-[1.05] tracking-tight md:text-4xl">
              Construyamos algo que perdure,{" "}
              <span className="text-[oklch(0.78_0.12_162)]">juntos.</span>
            </h3>
          </div>
          <Link
            to="/"
            hash="contacto"
            className="group inline-flex items-center gap-2 rounded-full bg-[oklch(0.78_0.12_162)] px-6 py-3.5 text-sm font-semibold text-[oklch(0.28_0.07_168)] shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Agenda una llamada
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>

      {/* Grid principal */}
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-12 lg:px-10">
        {/* Marca */}
        <div className="md:col-span-5">
          <div className="rounded-xl bg-primary-foreground/95 px-4 py-3 inline-block">
            <Logo />
          </div>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-primary-foreground/70">
            Transformamos empresas mexicanas con cimientos firmes: procesos, datos, automatización e inteligencia artificial — orquestados como un solo sistema.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3.5 py-1.5 text-xs font-semibold text-primary-foreground/80 backdrop-blur">
            <MapPin size={14} className="text-[oklch(0.78_0.12_162)]" />
            Ciudad de México
          </div>
        </div>

        {/* Navegar */}
        <div className="md:col-span-3">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[oklch(0.78_0.12_162)]">
            Navegar
          </h4>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-2 text-base text-primary-foreground/80 transition-colors hover:text-[oklch(0.78_0.12_162)]"
                >
                  <span className="h-px w-4 bg-primary-foreground/20 transition-all duration-300 group-hover:w-8 group-hover:bg-[oklch(0.78_0.12_162)]" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div className="md:col-span-4">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-[oklch(0.78_0.12_162)]">
            Contacto
          </h4>
          <ul className="mt-5 space-y-3">
            {contactLinks.map(({ icon: Icon, label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="group flex items-center gap-3 text-base text-primary-foreground/80 transition-colors hover:text-[oklch(0.78_0.12_162)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 text-[oklch(0.78_0.12_162)] transition-all duration-300 group-hover:border-[oklch(0.78_0.12_162)]/40 group-hover:bg-[oklch(0.78_0.12_162)]/10">
                    <Icon size={16} />
                  </span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-6 text-xs text-primary-foreground/60 md:flex-row md:items-center lg:px-10">
          <span>© {new Date().getFullYear()} BPM.io · Todos los derechos reservados.</span>
          <span className="inline-flex items-center gap-1.5">
            Hecho con cuidado en
            <span className="font-semibold text-primary-foreground/85">México</span>
            <span aria-hidden>🇲🇽</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
