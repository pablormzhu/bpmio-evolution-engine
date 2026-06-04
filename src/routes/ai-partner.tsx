import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";

import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/ai-partner")({
  head: () => ({
    meta: [
      { title: "AI Partner — Check Up Digital · BPM.io" },
      { name: "description", content: "Una lectura honesta de dónde estás y qué te conviene priorizar. En minutos." },
      { property: "og:title", content: "AI Partner — Check Up Digital · BPM.io" },
      { property: "og:description", content: "Habla con nuestro AI Partner y obtén tu Check Up Digital." },
    ],
  }),
  component: AIPartner,
});

function AIPartner() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative mx-auto w-full max-w-7xl px-6 pb-12 pt-12 lg:px-10 lg:pt-20">
        <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[480px] w-[480px] rounded-full bg-[oklch(0.78_0.12_162)] opacity-30 blur-3xl" />
        <span className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.78_0.12_162)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles size={12} /> Check Up Digital · gratuito
        </span>
        <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[0.95] text-primary md:text-7xl">
          Conoce a tu <span className="text-[oklch(0.55_0.13_162)]">AI Partner</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl">
          En minutos, una lectura honesta de dónde está tu empresa en su transformación digital,
          y qué te conviene priorizar. Sin compromiso. Sin ventas.
        </p>
      </section>

      {/* Chat + features */}
      <Section className="!pt-2 lg:!pt-4">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* AI Partner iframe */}
          <iframe
            src="https://creative-torrone-caf354.netlify.app/"
            className="h-[650px] w-full rounded-3xl border border-border shadow-soft lg:h-auto lg:self-stretch"
            style={{ border: "none" }}
          />

          {/* Prompts */}
          <div className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-soft lg:self-stretch">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} />
              <h3 className="text-base font-bold">Prompts con los que te puedo ayudar</h3>
            </div>
            <ul className="mt-5 space-y-4">
              {[
                { t: "CheckUp Digital", d: "Evalúa gratis el nivel de digitalización de tu empresa en 2 minutos." },
                { t: "Agendar una llamada", d: "Reserva un espacio con nuestro equipo para hablar de tu proyecto." },
                { t: "¿Qué hace BPM.io?", d: "Conoce nuestros servicios, tecnologías y enfoque." },
                { t: "Casos de éxito", d: "Mira cómo hemos ayudado a otras empresas a escalar." },
                { t: "Preguntas frecuentes", d: "Costos, tiempos, plataformas, tipos de procesos que automatizamos." },
              ].map(({ t, d }) => (
                <li key={t}>
                  <div className="group w-full rounded-2xl border border-border bg-surface p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[oklch(0.55_0.13_162)]/40 hover:shadow-soft">
                    <p className="text-sm font-semibold text-primary">{t}</p>
                    <p className="mt-1 text-xs leading-relaxed text-foreground/70">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
