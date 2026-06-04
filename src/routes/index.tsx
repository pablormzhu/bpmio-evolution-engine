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
      <section className="relative overflow-hidden border-b border-border/60">
        {/* Ambient backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.88_0.09_162/0.55),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.82_0.11_162/0.35),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.25_0.05_162) 1px, transparent 1px), linear-gradient(90deg, oklch(0.25_0.05_162) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
          <div className="animate-fade-up max-w-5xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-surface/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/75 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.55_0.13_162)] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.13_162)]" />
              </span>
              Cimientos firmes · Transformación que perdura
            </span>

            <h1 className="mt-8 text-balance text-[2.75rem] font-extrabold leading-[0.95] tracking-tight text-primary sm:text-7xl lg:text-[6.5rem]">
              Es momento de{" "}
              <span className="bg-gradient-to-br from-[oklch(0.55_0.13_162)] via-[oklch(0.65_0.15_160)] to-[oklch(0.78_0.12_162)] bg-clip-text text-transparent">
                evolucionar.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70 md:text-xl">
              Ayudamos a empresas mexicanas a evolucionar en su transformación digital.
              Tu equipo pone el conocimiento; nosotros lo transformamos en soluciones
              construidas desde cimientos sólidos.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <PrimaryCTA>Agenda una llamada</PrimaryCTA>
              <MintCTA>Hazte tu Check Up Digital</MintCTA>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border/60 sm:grid-cols-3">
            {[
              { k: "+30", l: "Empresas transformadas" },
              { k: "7", l: "Disciplinas orquestadas" },
              { k: "0", l: "Conflictos de interés" },
            ].map((s) => (
              <div key={s.l} className="bg-card/90 px-6 py-7 backdrop-blur">
                <p className="text-4xl font-extrabold tracking-tight text-primary md:text-5xl">
                  {s.k}
                </p>
                <p className="mt-2 text-sm font-medium text-foreground/65">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roles strip — full width */}
        <div className="border-t border-border/50 bg-surface/60 backdrop-blur">
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
        intro={
          <>
            Nadie conoce tu operación como quienes la viven todos los días. Por eso empezamos por
            escuchar: hacemos un levantamiento a fondo de tus procesos, datos y las necesidades
            reales de tu gente. Tu equipo pone el conocimiento; nosotros lo traducimos en
            soluciones —y los acompañamos hasta que se vuelven dueños de lo que construimos juntos.
          </>
        }
      >
        {/* Process flow — 4 steps */}
        <div className="relative">
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.12_162)]/60 to-transparent md:block" />

          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {[
              { n: "01", t: "Escuchar", d: "Levantamiento profundo de procesos, datos y personas." },
              { n: "02", t: "Diseñar", d: "Traducimos tu conocimiento en una solución a tu medida." },
              { n: "03", t: "Construir", d: "Implementamos con la tecnología correcta para tu reto." },
              { n: "04", t: "Acompañar", d: "Capacitamos a tu equipo hasta que sea dueño de la solución." },
            ].map((step) => (
              <li key={step.n} className="relative flex flex-col items-start">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-sm font-extrabold text-[oklch(0.55_0.13_162)] shadow-soft">
                  {step.n}
                </div>
                <h3 className="mt-5 text-xl font-bold text-primary">{step.t}</h3>
                <p className="mt-2 text-foreground/70 leading-relaxed">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Pull quote */}
        <div className="mt-14 rounded-3xl border border-border bg-gradient-to-br from-surface to-card p-8 shadow-soft md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[oklch(0.78_0.12_162)]/40 text-[oklch(0.35_0.08_162)]">
              <Ear size={26} />
            </div>
            <p className="text-pretty text-xl font-semibold leading-snug text-primary md:text-2xl">
              Preguntamos antes de proponer. Entendemos antes de construir.
              <span className="text-[oklch(0.55_0.13_162)]"> Acompañamos antes de soltar.</span>
            </p>
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
