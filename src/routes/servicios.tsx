import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { PrimaryCTA, MintCTA } from "@/components/site/CTA";
import {
  ClipboardList, Stethoscope, Target, Scale, Wrench, GraduationCap, HeartHandshake,
  Database, Workflow, Brain, Plug, Code2, Compass, Hammer, Rocket, Quote, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — BPM.io" },
      { name: "description", content: "Consultoría primero. Reingeniería, automatización, IA, integración y software a la medida orquestados a tu medida." },
      { property: "og:title", content: "Servicios — BPM.io" },
      { property: "og:description", content: "Consultoría primero. Orquestamos las piezas correctas para tu transformación." },
    ],
  }),
  component: Servicios,
});

const steps = [
  {
    icon: ClipboardList,
    t: "Levantamiento de información y procesos",
    d: "No solo los mapeamos: levantamos cómo funciona tu empresa en la realidad, para partir de hechos.",
    full: "No solo los mapeamos: levantamos cómo funciona tu empresa en la realidad, para partir de hechos y no de suposiciones.",
  },
  {
    icon: Stethoscope,
    t: "Diagnóstico",
    d: "Leemos tu situación según tus necesidades, retos y objetivos. Encontramos dónde está el valor.",
    full: "Leemos tu situación según tus necesidades, tus retos y tus objetivos, y encontramos dónde está el verdadero valor.",
  },
  {
    icon: Target,
    t: "Modelo de operación objetivo",
    d: "Diseñamos una forma clara y medible de cómo debe operar tu empresa, por etapas.",
    full: "Diseñamos una forma clara y medible de cómo debe operar tu empresa, definida por tus objetivos y dividida en etapas —porque la madurez se construye paso a paso.",
  },
  {
    icon: Scale,
    t: "El camino correcto, con objetividad",
    d: "Evaluamos todas las opciones con la misma vara. Definimos cuál y por qué —con objetividad.",
    full: "Evaluamos todas las opciones con la misma vara: a veces lo mejor es una solución off-the-shelf que ya existe, a veces low-code, a veces desarrollar algo a la medida. Definimos cuál y por qué.",
  },
  {
    icon: Wrench,
    t: "Ejecución",
    d: "Reingenieríamos, automatizamos, integramos y desarrollamos hasta que el modelo es operación.",
    full: "Reingenieríamos, automatizamos, integramos y desarrollamos, ensamblando los componentes correctos hasta que el modelo deja de ser un plan y se vuelve operación.",
  },
  {
    icon: GraduationCap,
    t: "Adopción",
    d: "Transferimos el conocimiento a tu equipo hasta que la solución es suya.",
    full: "Transferimos el conocimiento a tu equipo hasta que la solución es suya.",
  },
  {
    icon: HeartHandshake,
    t: "Socio activo",
    d: "Nos quedamos: medimos contra el modelo y lo hacemos madurar contigo.",
    full: "Nos quedamos: medimos contra el modelo, cuidamos que todo funcione y lo hacemos madurar contigo.",
  },
];

const pieces = [
  {
    icon: Database,
    t: "Información estandarizada y en tiempo real",
    d: "Tu información deja de vivir dispersa y de analizarse a destiempo. Te vuelves dueño en tiempo real.",
    full: "Que tu información deje de vivir dispersa y de analizarse a mano y a destiempo. La dejamos estandarizada, automatizada y al día, y te vuelves dueño de ella en tiempo real: para explorarla desde muchos ángulos, compararte con tu pasado y anticiparte a lo que viene. La operación deja de mirar al retrovisor.",
  },
  {
    icon: Workflow,
    t: "Automatización de procesos",
    d: "Devolvemos tiempo a tu equipo automatizando el trabajo repetitivo. Liberar, no reemplazar.",
    full: "El trabajo repetitivo y manual consume las horas de tu equipo. Lo automatizamos para devolverle ese tiempo y enfocarlo donde de verdad aporta —liberando a tu gente, no reemplazándola.",
  },
  {
    icon: Brain,
    t: "Inteligencia artificial que trabaja contigo",
    d: "IA entrenada y afinada para tus procesos. Un compañero más, no un sustituto.",
    full: "IA entrenada y afinada para entender tus procesos, que ejecuta tareas reales y le quita carga a tu equipo. No trabaja aislada: trabaja para y con tu gente, como un integrante más que aporta en sinergia. Un compañero, no un sustituto.",
  },
  {
    icon: Plug,
    t: "Integración y flujo de información",
    d: "Construimos lo que falta para que la información fluya. Que nada quede separado.",
    full: "Cuando tus sistemas están aislados, o no hacen lo que necesitas y se vuelven un cuello de botella, construimos lo que falta para que la información fluya. Que nada quede separado.",
  },
  {
    icon: Code2,
    t: "Software a la medida",
    d: "Cuando no existe nada en el mercado, diseñamos el software que tu empresa necesita.",
    full: "Cuando no existe nada en el mercado que encaje, diseñamos el software que tu empresa necesita —muchas veces, el puente que conecta tus otras herramientas y le da sinergia a todo el sistema.",
  },
];

function StepCard({
  Icon, index, title, short, full,
}: {
  Icon: typeof ClipboardList;
  index: number;
  title: string;
  short: string;
  full: string;
}) {
  const [open, setOpen] = useState(false);
  const isLong = full.length > short.length + 4;
  return (
    <li className="group relative ml-2 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-[oklch(0.78_0.12_162)] md:p-6">
      <div className="flex gap-5">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_162)] text-primary shadow-soft">
          <Icon size={20} />
          <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {index + 1}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-primary">{title}</h3>
          <p className="mt-1 text-foreground/70">{open || !isLong ? full : short}</p>
          {isLong && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[oklch(0.45_0.13_162)] transition-colors hover:text-primary"
            >
              {open ? "Ver menos" : "Ver más"}
              <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function PieceCard({
  Icon, title, short, full,
}: {
  Icon: typeof Database;
  title: string;
  short: string;
  full: string;
}) {
  const [open, setOpen] = useState(false);
  const isLong = full.length > short.length + 4;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[oklch(0.78_0.12_162)] to-primary opacity-0 transition-opacity group-hover:opacity-100" />
      <Icon size={26} className="text-[oklch(0.55_0.13_162)]" />
      <h3 className="mt-5 text-lg font-bold text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-foreground/70">{open || !isLong ? full : short}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[oklch(0.45_0.13_162)] transition-colors hover:text-primary"
        >
          {open ? "Ver menos" : "Ver más"}
          <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
    </article>
  );
}

const roles = [
  { icon: Compass, t: "Empezando desde cero", d: "Ponemos los cimientos: estandarización, levantamiento y definición del rumbo.", label: "Tus orientadores" },
  { icon: Hammer, t: "Con base, listos para avanzar", d: "Diseñamos y construimos el siguiente nivel, o destrabamos cuellos de botella.", label: "Consultores y ejecutores" },
  { icon: Rocket, t: "Con equipo propio pero rebasado", d: "Sumamos manos y velocidad, trabajando a su lado.", label: "Tu acelerador" },
];

const testimonios = [
  {
    quote: "BPM.io fue clave en la transformación de nuestro proceso comercial. Implementamos una infraestructura sólida y un CRM que nos permitió automatizar la prospección y decidir con análisis. Nuestro equipo hoy tiene mucho más alcance, eficiencia y claridad.",
    author: "Logistic Trade",
  },
  {
    quote: "La tecnología y la automatización siempre fueron parte de nuestro ADN, pero BPM.io fue el acelerador que necesitábamos. Desarrollaron funciones avanzadas dentro de nuestras propias herramientas y seguimos explorando juntos nuevas integraciones con IA.",
    author: "Sigtronic",
  },
];

function Servicios() {
  return (
    <SiteLayout>
      {/* La visión */}
      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.13_162)]" />
              La visión
            </span>
            <h2 className="text-balance text-3xl font-extrabold leading-[1.05] text-primary md:text-5xl">
              El reto no es la tecnología.{" "}
              <span className="text-[oklch(0.55_0.13_162)]">Es estar listo para ella.</span>
            </h2>
            <div className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
              Hoy la conversación gira alrededor de la IA y la automatización. Pero el verdadero
              reto está antes: estandarizar y automatizar tu información y tus procesos para tener
              una base lista, pulida y al día. Una base madura sobre la que la tecnología construye
              de verdad, en lugar de parchar.
            </div>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/75">
              Como cada empresa es un mundo, no hay receta única. Empezamos como consultores:
              entendemos tu caso a fondo y diseñamos, contigo, el modelo de operación objetivo que tu
              empresa necesita para llegar a donde quiere.
            </p>
          </div>

          {/* Visual derecho */}
          <div className="relative lg:col-span-5">
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[oklch(0.78_0.12_162)]/30 via-transparent to-[oklch(0.55_0.13_162)]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-soft">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-[oklch(0.78_0.12_162)]/40 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 translate-y-8 -translate-x-8 rounded-full bg-[oklch(0.55_0.13_162)]/20 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.12_162)]" />
                  Madurez digital
                </div>
                <h3 className="mt-5 text-2xl font-extrabold leading-tight text-primary">
                  Primero los cimientos. Después la tecnología.
                </h3>

                <ul className="mt-6 space-y-4">
                  {[
                    { n: "01", t: "Estandariza", d: "Información y procesos ordenados." },
                    { n: "02", t: "Automatiza", d: "El trabajo repetitivo deja de pesar." },
                    { n: "03", t: "Orquesta", d: "IA e integraciones sobre base firme." },
                  ].map((s) => (
                    <li key={s.n} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[oklch(0.78_0.12_162)] text-xs font-bold text-primary">
                        {s.n}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-primary">{s.t}</p>
                        <p className="text-sm text-foreground/70">{s.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-border bg-background/60 p-4 backdrop-blur">
                  <Sparkles size={18} className="shrink-0 text-[oklch(0.55_0.13_162)]" />
                  <p className="text-sm leading-snug text-foreground/80">
                    <span className="font-semibold text-primary">Sin recetas únicas.</span>{" "}
                    Diseñamos contigo el modelo que tu empresa necesita.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline 7 pasos */}
      <Section eyebrow="Cómo trabajamos" title={<>Consultoría primero.</>}>
        <ol className="relative space-y-4">
          <span className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-[oklch(0.78_0.12_162)] via-border to-transparent md:left-7" />
          {steps.map(({ icon: Icon, t, d, full }, i) => (
            <StepCard key={t} Icon={Icon} index={i} title={t} short={d} full={full} />
          ))}
        </ol>
      </Section>

      {/* Componentes que ensamblamos */}
      <Section
        eyebrow="Los componentes que ensamblamos"
        title={<>Las piezas que orquestamos a tu medida.</>}
        intro="Ningún proyecto es igual a otro. Según lo que pida tu modelo, combinamos:"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pieces.map(({ icon: Icon, t, d, full }) => (
            <PieceCard key={t} Icon={Icon} title={t} short={d} full={full} />
          ))}
        </div>
      </Section>

      {/* El rol que tomamos */}
      <Section eyebrow="El rol que tomamos" title={<>Dónde entramos depende de dónde estás.</>}>
        <div className="grid gap-5 md:grid-cols-3">
          {roles.map(({ icon: Icon, t, d, label }) => (
            <article key={t} className="rounded-2xl bg-primary p-7 text-primary-foreground shadow-soft">
              <Icon size={26} className="text-[oklch(0.78_0.12_162)]" />
              <h3 className="mt-5 text-xl font-bold">{t}</h3>
              <p className="mt-3 text-primary-foreground/75">{d}</p>
              <span className="mt-5 inline-block rounded-full bg-[oklch(0.78_0.12_162)] px-3 py-1 text-xs font-bold text-primary">
                {label}
              </span>
            </article>
          ))}
        </div>
      </Section>

      {/* Testimonios */}
      <Section
        eyebrow="Lo que dicen de nosotros"
        title={<>Trabajamos para tener fans, <span className="text-[oklch(0.55_0.13_162)]">no solo clientes</span>.</>}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {testimonios.map((t) => (
            <figure
              key={t.author}
              className="relative rounded-2xl border border-border bg-card p-8 pt-16 shadow-soft"
            >
              <Quote className="absolute right-6 top-6 text-[oklch(0.78_0.12_162)]" size={36} />
              <blockquote className="text-lg leading-relaxed text-foreground/85">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 text-sm font-bold uppercase tracking-wider text-[oklch(0.55_0.13_162)]">
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Cierre */}
      <Section eyebrow="Cierre" title={<>Empieza por entender dónde estás.</>}>
        <p className="max-w-2xl text-lg text-foreground/75">
          Un Check Up Digital gratuito, o una llamada, para leer juntos tu situación y ver cuál es
          el primer paso.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryCTA />
          <MintCTA />
        </div>
      </Section>
    </SiteLayout>
  );
}
