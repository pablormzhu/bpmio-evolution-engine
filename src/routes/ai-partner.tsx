import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";

import {
  Sparkles,
  MessageSquare,
  ClipboardCheck,
  CalendarClock,
  Building2,
  TrendingUp,
  HelpCircle,
  ArrowRight,
  Clock,
  ShieldCheck,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/ai-partner")({
  head: () => ({
    meta: [
      { title: "AI Partner — Check Up Digital · BPM.io" },
      { name: "description", content: "Una lectura honesta de dónde estás y qué te conviene priorizar. En minutos." },
      { property: "og:title", content: "AI Partner — Check Up Digital · BPM.io" },
      { property: "og:description", content: "Habla con nuestro AI Partner y obtén tu Check Up Digital." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AIPartner,
});

const prompts = [
  {
    icon: ClipboardCheck,
    t: "CheckUp Digital",
    d: "Evalúa gratis el nivel de digitalización de tu empresa en 2 minutos.",
  },
  {
    icon: CalendarClock,
    t: "Agendar una llamada",
    d: "Reserva un espacio con nuestro equipo para hablar de tu proyecto.",
  },
  {
    icon: Building2,
    t: "¿Qué hace BPM.io?",
    d: "Conoce nuestros servicios, tecnologías y enfoque.",
  },
  {
    icon: TrendingUp,
    t: "Casos de éxito",
    d: "Mira cómo hemos ayudado a otras empresas a escalar.",
  },
  {
    icon: HelpCircle,
    t: "Preguntas frecuentes",
    d: "Costos, tiempos, plataformas, tipos de procesos que automatizamos.",
  },
];

const steps = [
  {
    n: "01",
    title: "Habla con el AI Partner",
    desc: "Cuéntale en lenguaje natural cómo opera tu empresa. No necesitas preparar nada.",
  },
  {
    n: "02",
    title: "Recibe tu diagnóstico",
    desc: "En minutos obtienes una lectura honesta de tu madurez digital y áreas de oportunidad.",
  },
  {
    n: "03",
    title: "Define el siguiente paso",
    desc: "Te sugerimos qué priorizar primero y, si tiene sentido, agendamos una llamada.",
  },
];

const benefits = [
  {
    icon: Clock,
    title: "En 2 minutos",
    desc: "Diagnóstico rápido sin cuestionarios largos ni formularios tediosos.",
  },
  {
    icon: Target,
    title: "Prioridades claras",
    desc: "Te decimos qué es lo primero que deberías atacar según tu contexto.",
  },
  {
    icon: ShieldCheck,
    title: "Sin compromiso",
    desc: "Sin ventas agresivas ni costos ocultos. Solo una lectura honesta.",
  },
];

function AIPartner() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-0 top-0 h-[520px] w-[520px] rounded-full bg-[oklch(0.78_0.12_162)] opacity-25 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[oklch(0.55_0.13_162)] opacity-15 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-10 pt-12 lg:px-10 lg:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.78_0.12_162)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles size={12} /> Check Up Digital · gratuito
          </span>
          <h1 className="mt-6 max-w-4xl text-balance text-5xl font-extrabold leading-[0.95] text-primary md:text-7xl">
            Conoce a tu <span className="text-[oklch(0.55_0.13_162)]">AI Partner</span>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl">
            En minutos, una lectura honesta de dónde está tu empresa en su transformación digital,
            y qué te conviene priorizar. Sin compromiso. Sin ventas.
          </p>
        </div>
      </section>

      {/* Chat + prompts */}
      <Section className="!pt-2 lg:!pt-4">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          {/* AI Partner iframe — app mockup */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-[oklch(0.78_0.12_162)]/15 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <iframe
                src="https://creative-torrone-caf354.netlify.app/"
                className="h-[650px] w-full bg-card lg:h-auto lg:min-h-[700px]"
                style={{ border: "none" }}
                title="BPM AI Partner"
              />
            </div>
          </div>

          {/* Prompts panel */}
          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft lg:self-stretch lg:p-8">
            <div className="flex items-center gap-2 text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[oklch(0.78_0.12_162)]/20 text-primary">
                <MessageSquare size={14} />
              </span>
              <h3 className="text-base font-bold">Prompts con los que te puedo ayudar</h3>
            </div>
            <p className="mt-2 text-sm text-foreground/60">
              Toca cualquiera para inspirar tu conversación con el AI Partner.
            </p>

            <ul className="mt-6 space-y-3">
              {prompts.map(({ icon: Icon, t, d }) => (
                <li key={t}>
                  <button
                    type="button"
                    className="group flex w-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[oklch(0.55_0.13_162)]/40 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_162)]/20 text-primary transition-colors group-hover:bg-[oklch(0.78_0.12_162)]">
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                        {t}
                        <ArrowRight
                          size={12}
                          className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-foreground/70">{d}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto rounded-2xl border border-[oklch(0.78_0.12_162)]/30 bg-[oklch(0.78_0.12_162)]/10 p-5">
              <p className="text-sm font-semibold text-primary">¿Prefieres hablar con una persona?</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/70">
                Agenda una llamada gratuita de 30 minutos con nuestro equipo.
              </p>
              <Link
                to="/"
                hash="calendario"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <CalendarClock size={14} />
                Agendar una llamada
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section
        eyebrow="Cómo funciona"
        title="Tu diagnóstico en 3 pasos"
        intro="No es un cuestionario estático. Es una conversación que te lleva de la idea a la acción."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ n, title, desc }) => (
            <div
              key={n}
              className="relative rounded-3xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="text-4xl font-extrabold leading-none text-[oklch(0.78_0.12_162)]/40">{n}</span>
              <h3 className="mt-4 text-lg font-bold text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section className="pb-10 lg:pb-14">
        <div className="rounded-[2rem] border border-border bg-card p-8 shadow-soft lg:p-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary/80">
                <Sparkles size={12} />
                Beneficios
              </span>
              <h2 className="mt-5 text-balance text-3xl font-extrabold leading-[1.05] text-primary md:text-4xl">
                Una lectura honesta, <span className="text-[oklch(0.55_0.13_162)]">sin fricción.</span>
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
                El AI Partner está entrenado para entender el contexto de tu empresa y darte
                recomendaciones prácticas que puedas ejecutar desde el primer día.
              </p>
              <Link
                to="/"
                hash="calendario"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                <CalendarClock size={16} />
                Agendar una llamada
              </Link>
            </div>

            <div className="space-y-4">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_162)]/20 text-primary">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-primary">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/70">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
