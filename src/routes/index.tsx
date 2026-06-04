import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { PrimaryCTA, MintCTA } from "@/components/site/CTA";
import {
  Database, Workflow, Brain, Boxes, Code2, BarChart3, GraduationCap,
  Compass, Hammer, Rocket, Ear, Layers, Shield, Mail, Linkedin, Phone, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BPM.io — Es momento de evolucionar" },
      { name: "description", content: "Ayudamos a empresas mexicanas a evolucionar en su transformación digital sobre cimientos firmes." },
      { property: "og:title", content: "BPM.io — Es momento de evolucionar" },
      { property: "og:description", content: "Procesos, datos, automatización e IA, orquestados como un solo sistema." },
    ],
  }),
  component: Home,
});

const roles = ["Orientadores", "Consultores", "Ejecutores", "Aceleradores", "Capacitadores"];

const orchestration = [
  { icon: Boxes, title: "Soluciones listas", desc: "Off-the-shelf cuando ya existe lo ideal para ti." },
  { icon: Workflow, title: "Plataformas low-code", desc: "Para construir rápido y con flexibilidad." },
  { icon: Code2, title: "Desarrollo a la medida", desc: "Pro-code cuando tu reto es único." },
];

const maturity = [
  { icon: Compass, label: "Diagnóstico y estrategia" },
  { icon: Layers, label: "Reingeniería de procesos y datos" },
  { icon: Workflow, label: "Automatización de procesos" },
  { icon: Brain, label: "Inteligencia artificial aplicada" },
  { icon: Code2, label: "Software a la medida" },
  { icon: BarChart3, label: "Business intelligence y analítica" },
  { icon: GraduationCap, label: "Adopción y capacitación" },
];

const logos = ["Logistic Trade", "Sigtronic", "Acme MX", "Norte Capital", "Veridia", "Cobre & Co"];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[600px] w-[600px] rounded-full bg-[oklch(0.85_0.1_162)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 -z-10 h-[360px] w-[360px] rounded-full bg-[oklch(0.78_0.12_162)] opacity-25 blur-3xl" />
        <div className="grain-lines pointer-events-none absolute inset-0 -z-10 opacity-30" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-10 lg:pb-28 lg:pt-20">
          {/* LEFT — copy */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary/80 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.55_0.13_162)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.13_162)]" />
              </span>
              Cimientos firmes · Transformación que perdura
            </span>

            <h1 className="mt-7 text-balance text-[2.75rem] font-extrabold leading-[0.95] tracking-tight text-primary sm:text-6xl lg:text-[5.25rem]">
              Es momento <br className="hidden sm:block" />
              de{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="relative z-10">evolucionar</span>
                <svg
                  viewBox="0 0 300 14"
                  className="absolute -bottom-2 left-0 z-0 h-3 w-full text-[oklch(0.78_0.12_162)]"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 8 Q 75 1, 150 6 T 298 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-foreground/70 md:text-lg">
              Ayudamos a empresas mexicanas a evolucionar en su transformación digital.
              Tu equipo pone el conocimiento; nosotros lo transformamos en soluciones construidas
              desde cimientos sólidos.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryCTA>Agenda una llamada</PrimaryCTA>
              <MintCTA>Hazte tu Check Up Digital</MintCTA>
            </div>

            <div className="mt-10 flex items-center gap-5">
              <div className="flex -space-x-2">
                {["LT", "SG", "AC", "NV"].map((i, idx) => (
                  <span
                    key={i}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-[oklch(0.78_0.12_162)] text-[11px] font-bold text-primary"
                    style={{ zIndex: 10 - idx }}
                  >
                    {i}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground/65">
                <span className="font-bold text-primary">+30 empresas mexicanas</span> ya
                evolucionaron con nosotros.
              </p>
            </div>
          </div>

          {/* RIGHT — visual panel */}
          <div className="relative hidden lg:block">
            <div className="relative h-full">
              {/* Main card */}
              <div className="animate-float-slow absolute inset-0 rotate-[2deg]">
                <div className="relative h-full overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-glow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/60">
                      Tu transformación
                    </span>
                    <span className="flex h-2 w-2 rounded-full bg-[oklch(0.7_0.18_150)]" />
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      { label: "Procesos", value: 92, tag: "Estandarizados" },
                      { label: "Datos", value: 78, tag: "En tiempo real" },
                      { label: "Automatización", value: 64, tag: "En crecimiento" },
                      { label: "IA aplicada", value: 41, tag: "En adopción" },
                    ].map((row, i) => (
                      <div
                        key={row.label}
                        className="rounded-xl border border-border bg-surface px-4 py-3"
                        style={{ animation: `fade-up 0.7s ${i * 0.12}s both` }}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-semibold text-primary">{row.label}</span>
                          <span className="text-xs font-bold text-[oklch(0.55_0.13_162)]">
                            {row.value}%
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.55_0.13_162)] to-[oklch(0.78_0.12_162)]"
                            style={{ width: `${row.value}%` }}
                          />
                        </div>
                        <p className="mt-1.5 text-[11px] text-muted-foreground">{row.tag}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-3 rounded-xl bg-primary p-3 text-primary-foreground">
                    <Sparkles size={16} className="text-[oklch(0.78_0.12_162)]" />
                    <span className="text-xs font-semibold">
                      Listo para sumar nuevas tecnologías de forma modular.
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating tag — top */}
              <div className="absolute -left-6 -top-4 rotate-[-6deg] rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Maduración
                </p>
                <p className="text-sm font-extrabold text-primary">Procesos → Datos → IA</p>
              </div>

              {/* Floating tag — bottom */}
              <div className="absolute -bottom-4 -right-2 rotate-[4deg] rounded-2xl bg-[oklch(0.78_0.12_162)] px-4 py-3 text-primary shadow-glow">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                  Sin conflictos de interés
                </p>
                <p className="text-sm font-extrabold">El camino correcto.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Roles strip — full width */}
        <div className="border-y border-border/50 bg-surface/60 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 lg:px-10">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary/60">
              Te acompañamos como
            </span>
            <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
              {roles.map((r, i) => (
                <span key={r} className="flex items-center gap-3 text-sm font-semibold text-primary/85">
                  {r}
                  {i < roles.length - 1 && (
                    <span className="hidden text-[oklch(0.55_0.13_162)]/40 sm:inline">/</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* LO QUE CREEMOS */}
      <Section
        eyebrow="Lo que creemos"
        title={<>Creemos en la transformación <em className="not-italic text-[oklch(0.55_0.13_162)]">que perdura</em>.</>}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              t: "No es comprar tecnología",
              d: "Transformarse es un proceso de maduración: se aprende, se disfruta y se mejora con el tiempo.",
            },
            {
              icon: Layers,
              t: "Cimientos firmes",
              d: "Procesos, cultura y tecnología bien elegidos. Así la transformación es un éxito, no un arrepentimiento.",
            },
            {
              icon: Rocket,
              t: "Listo para lo que viene",
              d: "Lo que construyes hoy se suma de forma modular cuando llegan nuevas tecnologías. No empiezas de cero.",
            },
          ].map(({ icon: Icon, t, d }) => (
            <article
              key={t}
              className="group rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_162)]"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={20} />
              </div>
              <h3 className="text-xl font-bold text-primary">{t}</h3>
              <p className="mt-3 text-foreground/70 leading-relaxed">{d}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* ESCUCHAMOS PRIMERO */}
      <Section
        eyebrow="Escuchamos primero"
        title={<>Tu equipo es el experto. <span className="text-[oklch(0.55_0.13_162)]">Nosotros escuchamos.</span></>}
      >
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="space-y-5 text-lg leading-relaxed text-foreground/75">
            <p>
              Nadie conoce tu operación como quienes la viven todos los días. Por eso empezamos por
              escuchar: hacemos un levantamiento a fondo de tus procesos, tus datos y las
              necesidades reales de tu gente.
            </p>
            <p>
              Tu equipo pone el conocimiento y la experiencia; nosotros los traducimos en soluciones.
              Y a lo largo del camino los acompañamos y los capacitamos, hasta que se vuelven dueños
              de lo que construimos juntos.
            </p>
          </div>
          <div className="relative aspect-square rounded-3xl border border-border bg-surface p-8 shadow-soft">
            <div className="grain-lines absolute inset-0 rounded-3xl opacity-40" />
            <div className="relative flex h-full flex-col items-center justify-center text-center">
              <Ear size={56} className="text-[oklch(0.55_0.13_162)]" />
              <p className="mt-6 text-2xl font-extrabold text-primary">Escuchar → Diseñar → Construir → Acompañar</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ORQUESTAMOS */}
      <Section
        eyebrow="Cómo orquestamos"
        title={<>Orquestamos todo lo que tu transformación necesita.</>}
        intro="Una transformación real no depende de una sola herramienta. Tus datos, procesos, automatización e IA trabajando juntos, como un solo sistema."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {orchestration.map(({ icon: Icon, title, desc }, i) => (
            <article
              key={title}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1"
            >
              <span className="absolute right-5 top-5 text-5xl font-extrabold text-[oklch(0.78_0.12_162)]/40">
                0{i + 1}
              </span>
              <Icon size={28} className="text-[oklch(0.55_0.13_162)]" />
              <h3 className="mt-5 text-xl font-bold text-primary">{title}</h3>
              <p className="mt-2 text-foreground/70">{desc}</p>
            </article>
          ))}
        </div>
        <p className="mt-10 max-w-2xl text-lg italic text-primary/80">
          Lo importante no es la tecnología que usamos, sino que todo encaje y de verdad te sirva.
        </p>
      </Section>

      {/* TE ENCONTRAMOS DONDE ESTÉS */}
      <Section
        eyebrow="Te encontramos donde estés"
        title={<>Cualquier industria. Cualquier tamaño. Cualquier punto del camino.</>}
        intro="Algunas empresas llegan con un proceso específico que resolver; otras con la pregunta de por dónde empezar. Te acompañamos en cualquier nivel de madurez."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {maturity.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-4 transition-colors hover:border-[oklch(0.78_0.12_162)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-[oklch(0.55_0.13_162)]">
                <Icon size={18} />
              </div>
              <span className="font-medium text-primary">{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CONOCIMIENTO ABIERTO */}
      <Section
        eyebrow="Conocimiento abierto"
        title={<>Lo que sabemos, <span className="text-[oklch(0.55_0.13_162)]">lo compartimos</span>.</>}
      >
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground md:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[oklch(0.78_0.12_162)]/40 blur-3xl" />
          <div className="grain-lines absolute inset-0 opacity-20" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <p className="text-lg leading-relaxed text-primary-foreground/85">
                Creemos en contribuir. Por eso orientamos y compartimos lo que sabemos —seas
                cliente o no, sin esperar nada a cambio. Empieza con un Check Up Digital gratuito:
                nuestro AI Partner te da, en minutos, una lectura honesta de dónde estás.
              </p>
              <div className="mt-7">
                <MintCTA>Hablar con el AI Partner</MintCTA>
              </div>
            </div>
            <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur">
              <Sparkles className="text-[oklch(0.78_0.12_162)]" />
              <p className="mt-4 text-2xl font-extrabold leading-tight">
                Una lectura honesta de dónde estás y qué te conviene priorizar.
              </p>
            </div>
          </div>
        </div>

        {/* Logos carrusel */}
        <div className="mt-14">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-primary/60">
            Algunos de nuestros clientes
          </p>
          <div className="mt-6 overflow-hidden">
            <div className="flex animate-[shimmer_30s_linear_infinite] gap-12">
              {[...logos, ...logos, ...logos].map((l, i) => (
                <span key={i} className="shrink-0 text-2xl font-extrabold tracking-tight text-primary/40">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* CONTACTO / PLATIQUEMOS */}
      <Section
        id="contacto"
        eyebrow="Platiquemos"
        title={<>Platiquemos.</>}
        intro="Si estás pensando en una iniciativa, o simplemente necesitas orientación, te invitamos a una llamada para platicar y compartir experiencia. Sin compromiso: solo una conversación honesta sobre tu empresa."
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <iframe
              title="Agenda una llamada con BPM.io"
              src="https://calendly.com/d/cm74-mh3-jzf?embed_domain=bpmio.com.mx&embed_type=Inline"
              className="h-[640px] w-full"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:info@bpmio.com.mx"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_162)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-[oklch(0.55_0.13_162)]">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Escríbenos</p>
                <p className="font-semibold text-primary">info@bpmio.com.mx</p>
              </div>
            </a>
            <a
              href="tel:+525580100974"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_162)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-[oklch(0.55_0.13_162)]">
                <Phone size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Llámanos</p>
                <p className="font-semibold text-primary">+52 55 8010 0974</p>
              </div>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-[oklch(0.78_0.12_162)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-[oklch(0.55_0.13_162)]">
                <Linkedin size={20} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Síguenos</p>
                <p className="font-semibold text-primary">LinkedIn</p>
              </div>
            </a>
            <div className="mt-2 rounded-2xl bg-[oklch(0.78_0.12_162)]/30 p-5 text-sm text-primary/80">
              <Hammer className="mb-2" size={18} />
              Sin compromiso: solo una conversación honesta sobre tu empresa.
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
