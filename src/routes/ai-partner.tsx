import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Section } from "@/components/site/Section";
import { PrimaryCTA } from "@/components/site/CTA";
import { Sparkles, Send, Bot, User, Zap, Eye, Compass } from "lucide-react";

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

type Msg = { role: "user" | "ai"; text: string };

function AIPartner() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hola 👋 Soy el AI Partner de BPM.io. Cuéntame en una frase a qué se dedica tu empresa y dónde sientes el mayor cuello de botella hoy.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: "user", text },
      {
        role: "ai",
        text:
          "Gracias por compartirlo. Para darte una lectura más completa: ¿cómo manejan hoy su información clave (hojas de cálculo, sistemas, dispersa)? Esto me permite ubicar tu punto de partida en el Check Up.",
      },
    ]);
    setInput("");
  };

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
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Chat */}
          <div className="flex h-[620px] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft lg:h-auto lg:self-stretch">
            <div className="flex items-center gap-3 border-b border-border bg-surface px-6 py-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot size={18} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-[oklch(0.7_0.18_150)]" />
              </div>
              <div>
                <p className="font-bold text-primary">BPM.io · AI Partner</p>
                <p className="text-xs text-muted-foreground">Disponible · responde en segundos</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      m.role === "ai"
                        ? "bg-[oklch(0.78_0.12_162)] text-primary"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {m.role === "ai" ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "ai"
                        ? "bg-secondary text-primary"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-border bg-surface p-4"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Cuéntame sobre tu empresa…"
                className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.55_0.13_162)] focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5"
                aria-label="Enviar"
              >
                <Send size={16} />
              </button>
            </form>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Eye, t: "Diagnóstico honesto", d: "Te decimos lo que vemos, no lo que quieres oír." },
              { icon: Compass, t: "Prioridades claras", d: "Qué resolver primero según tu madurez actual." },
              { icon: Zap, t: "Sin ventas, sin presión", d: "Si no necesitas nada, te lo decimos también." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[oklch(0.78_0.12_162)] text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-primary">{t}</h3>
                <p className="mt-1 text-sm text-foreground/70">{d}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-soft">
              <p className="text-sm text-primary-foreground/75">¿Prefieres una conversación humana?</p>
              <div className="mt-4">
                <PrimaryCTA>Agenda una llamada</PrimaryCTA>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
