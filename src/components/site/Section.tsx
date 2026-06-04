import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`mx-auto w-full max-w-7xl px-6 py-20 lg:px-10 lg:py-28 ${className}`}>
      {(eyebrow || title || intro) && (
        <div className="mb-12 max-w-3xl">
          {eyebrow && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.55_0.13_162)]" />
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-balance text-3xl font-extrabold leading-[1.05] text-primary md:text-5xl">
              {title}
            </h2>
          )}
          {intro && (
            <div className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
              {intro}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
