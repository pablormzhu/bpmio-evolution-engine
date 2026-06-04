import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { PrimaryCTA } from "@/components/site/CTA";
import { Layers, Users, Scale, Award, Share2 } from "lucide-react";

export const Route = createFileRoute("/filosofia")({
  head: () => ({
    meta: [
      { title: "Filosofía — BPM.io" },
      { name: "description", content: "Creemos en los cimientos, en las personas, en la objetividad, en la excelencia y en compartir." },
      { property: "og:title", content: "Filosofía — BPM.io" },
      { property: "og:description", content: "En qué creemos y de dónde venimos." },
    ],
  }),
  component: Filosofia,
});

const beliefs = [
  {
    icon: Layers,
    t: "Creemos en los cimientos",
    d: "La excelencia no se improvisa: se construye sobre bases firmes. Procesos claros, una cultura que acompaña el cambio y tecnología bien elegida. Lo que se construye hoy sigue sirviendo mañana —las nuevas tecnologías se suman de forma modular.",
  },
  {
    icon: Users,
    t: "Creemos en las personas",
    d: "Tu equipo es el experto en lo que hace. Nosotros traducimos su conocimiento y su visión en soluciones, y lo acompañamos hasta que son suyas. No buscamos que dependan de nosotros, sino que se queden con una capacidad nueva.",
  },
  {
    icon: Scale,
    t: "Creemos en la objetividad",
    d: "No nos casamos con ninguna tecnología ni con ningún proveedor. Analizamos cada situación con honestidad y recomendamos el camino correcto —ya sea una solución que ya existe o una hecha a la medida. Nuestra lealtad es con el resultado.",
  },
  {
    icon: Award,
    t: "Creemos en la excelencia",
    d: "Creemos en los estándares más altos: en las metodologías, en el orden y en hacer el trabajo difícil bien desde el principio, no en atajos que se pagan después. De cada uno de nuestros proyectos —sin excepción— estamos orgullosos.",
  },
  {
    icon: Share2,
    t: "Creemos en compartir",
    d: "El conocimiento crece cuando se comparte. Orientamos y compartimos lo que sabemos sin esperar nada a cambio, seas cliente o no. Es nuestra forma de contribuir.",
  },
];

function Filosofia() {
  return (
    <SiteLayout>
      {/* Por qué hacemos esto */}
      <Section
        eyebrow="Por qué hacemos esto"
        title={<>La transformación digital de México <span className="text-[oklch(0.55_0.13_162)]">no debería ser un lujo.</span></>}
      >
        <div className="grid gap-8 text-lg leading-relaxed text-foreground/75 md:grid-cols-2">
          <p>
            En BPM.io creemos que cualquier empresa —sin importar su tamaño— merece transformarse
            bien: sobre bases sólidas, a su ritmo, y de una forma que se disfrute en lugar de
            sufrirse.
          </p>
          <p>
            Por eso trabajamos. No solo para entregar proyectos, sino para acompañar a las empresas
            mexicanas a madurar, y para compartir lo que sabemos con quien lo necesite —sea
            cliente o no. Es, sencillamente, en lo que creemos.
          </p>
        </div>
      </Section>

      {/* Creencias */}
      <Section eyebrow="Lo que creemos">
        <div className="grid gap-5 md:grid-cols-2">
          {beliefs.map(({ icon: Icon, t, d }, i) => (
            <article
              key={t}
              className={`rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 ${
                i === 4 ? "md:col-span-2" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_162)] text-primary">
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl font-extrabold text-primary">{t}</h3>
              </div>
              <p className="mt-5 leading-relaxed text-foreground/75">{d}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* De dónde venimos */}
      <Section eyebrow="De dónde venimos" title={<>Nacimos de una convicción.</>}>
        <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-start">
          <div className="rounded-3xl bg-primary p-8 text-primary-foreground shadow-soft">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[oklch(0.78_0.12_162)] text-3xl font-extrabold text-primary">
              PR
            </div>
            <p className="mt-6 text-2xl font-extrabold">Pablo Ramírez Huitrón</p>
            <p className="mt-1 text-primary-foreground/70">Socio Fundador · BPM.io</p>
            <div className="mt-6 h-px bg-primary-foreground/15" />
            <p className="mt-4 text-sm text-primary-foreground/70">
              Ex KPMG · M&A · Automatización de procesos
            </p>
          </div>
          <div className="space-y-5 text-lg leading-relaxed text-foreground/75">
            <p>
              BPM.io nació de la experiencia de su fundador. Tras formarse en consultoría y
              optimización de procesos en KPMG, y liderar la automatización en una firma de
              M&A —donde ayudó a construir un pipeline de más de 2 mil millones de dólares—,
              vio de cerca un patrón claro: la tecnología, por sí sola, no transforma a una empresa.
            </p>
            <p>
              Lo que transforma es entender el negocio a fondo y construir, desde los cimientos,
              soluciones que la gente realmente hace suyas. De esa convicción nació BPM.io: para
              acompañar a las empresas mexicanas a transformarse bien, sin importar su tamaño ni
              su punto de partida.
            </p>
          </div>
        </div>
      </Section>

      {/* Cierre */}
      <Section eyebrow="Cierre" title={<>Esto es lo que somos.</>}>
        <p className="max-w-2xl text-lg text-foreground/75">
          Y es lo que ponemos en cada proyecto, en cada conversación y en cada empresa que decide
          evolucionar. Si quieres platicar sobre tu propia transformación —seas cliente o no—
          aquí estamos, con gusto.
        </p>
        <div className="mt-8">
          <PrimaryCTA />
        </div>
      </Section>
    </SiteLayout>
  );
}
