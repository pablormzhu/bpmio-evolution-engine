import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { PrimaryCTA } from "@/components/site/CTA";
import { Layers, Users, Scale, Award, Share2, Heart, MapPin, Sparkles } from "lucide-react";
import pabloPhoto from "@/assets/pablo-ramirez.png";

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
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[oklch(0.97_0.02_162)] via-background to-background" />
        <div className="absolute -right-32 top-20 -z-10 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.78_0.12_162)]/25 blur-[120px]" />
        <div className="absolute -left-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-[oklch(0.55_0.13_162)]/15 blur-[100px]" />

        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
            {/* Columna izquierda: manifiesto */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.55_0.13_162)]/25 bg-background/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur">
                <Sparkles size={12} className="text-[oklch(0.55_0.13_162)]" />
                Por qué hacemos esto
              </div>

              <h2 className="mt-7 text-balance text-4xl font-extrabold leading-[0.98] tracking-tight text-primary md:text-6xl lg:text-[4.25rem]">
                La transformación digital de México{" "}
                <span className="font-serif italic font-bold text-[oklch(0.55_0.13_162)]">
                  no debería
                </span>{" "}
                ser un lujo.
              </h2>


              <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border/60 sm:grid-cols-2">
                <div className="bg-card p-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.55_0.13_162)]">
                    Lo que creemos
                  </p>
                  <p className="mt-3 leading-relaxed text-foreground/80">
                    Cualquier empresa —sin importar su tamaño— merece transformarse{" "}
                    <span className="font-semibold text-primary">bien</span>: sobre bases sólidas, a
                    su ritmo, y de una forma que se disfrute en lugar de sufrirse.
                  </p>
                </div>
                <div className="bg-card p-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[oklch(0.55_0.13_162)]">
                    Por eso trabajamos
                  </p>
                  <p className="mt-3 leading-relaxed text-foreground/80">
                    No solo para entregar proyectos, sino para acompañar a las empresas mexicanas a
                    madurar —y para compartir lo que sabemos con quien lo necesite, sea cliente o
                    no.
                  </p>
                </div>
              </div>
            </div>

            {/* Columna derecha: tarjeta sello */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-[oklch(0.78_0.12_162)]/50 to-transparent blur-2xl" />
                <article className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-primary p-10 text-primary-foreground shadow-soft">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[oklch(0.78_0.12_162)]/30 blur-2xl" />
                  <div className="absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-[oklch(0.55_0.13_162)]/40 blur-2xl" />

                  <div className="relative">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[oklch(0.85_0.10_162)] backdrop-blur">
                      <MapPin size={11} />
                      Hecho en México
                    </div>

                    <p className="mt-6 font-serif text-[5.5rem] leading-none text-[oklch(0.78_0.12_162)]">
                      “
                    </p>
                    <blockquote className="-mt-10 text-2xl font-semibold leading-snug tracking-tight text-primary-foreground md:text-[1.75rem]">
                      Madurar en lugar de improvisar.{" "}
                      <span className="text-[oklch(0.85_0.10_162)]">
                        Acompañar en lugar de entregar.
                      </span>{" "}
                      Compartir en lugar de guardarnos lo que sabemos.
                    </blockquote>

                    <div className="mt-10 flex items-center gap-4 border-t border-primary-foreground/15 pt-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.78_0.12_162)] text-primary">
                        <Heart size={16} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-primary-foreground/60">
                          Nuestra convicción
                        </p>
                        <p className="text-sm font-bold text-primary-foreground">
                          Es, sencillamente, en lo que creemos.
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            <div className="h-28 w-28 overflow-hidden rounded-full ring-4 ring-[oklch(0.78_0.12_162)]/40">
              <img
                src={pabloPhoto}
                alt="Pablo Ramírez Huitrón"
                className="h-full w-full object-cover"
              />
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
