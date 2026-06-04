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
      <section className="relative mx-auto w-full max-w-7xl px-6 pb-16 pt-10 lg:px-10 lg:pb-24 lg:pt-16">
        <div className="pointer-events-none absolute right-0 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-[oklch(0.85_0.1_162)] opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-[oklch(0.78_0.12_162)] opacity-25 blur-3xl" />

        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary/80 backdrop-blur">
            <Sparkles size={12} /> Transformación digital con cimientos firmes
          </span>
          <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[0.95] text-primary md:text-7xl lg:text-8xl">
            Es momento de <span className="relative inline-block">
              evolucionar
              <span className="absolute -bottom-1 left-0 h-[10px] w-full rounded-full bg-[oklch(0.78_0.12_162)]/60" />
            </span>.
          </h1>
          <p className="mt-7 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/75 md:text-xl">
            En BPM.io ayudamos a empresas mexicanas de todas las industrias y tamaños a evolucionar
            en su transformación digital. Junto a nuestros clientes formamos un equipo: ellos ponen
            el conocimiento y la visión, y nosotros los transformamos en soluciones construidas
            desde cimientos sólidos.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {roles.map((r) => (
              <span
                key={r}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-primary/80"
              >
                {r}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <PrimaryCTA>Agenda una llamada</PrimaryCTA>
            <MintCTA>Hazte tu Check Up Digital</MintCTA>
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
