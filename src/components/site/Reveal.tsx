import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ElementType } from "react";

type Direction = "up" | "left" | "right" | "scale";

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  as: As = "div",
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden: CSSProperties =
    direction === "left"
      ? { opacity: 0, transform: "translate3d(-24px,0,0)" }
      : direction === "right"
      ? { opacity: 0, transform: "translate3d(24px,0,0)" }
      : direction === "scale"
      ? { opacity: 0, transform: "scale(0.96)" }
      : { opacity: 0, transform: "translate3d(0,24px,0)" };

  const shown: CSSProperties = { opacity: 1, transform: "none" };

  const style: CSSProperties = {
    ...(visible ? shown : hidden),
    transition: `opacity 0.75s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.85s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return (
    <As ref={ref as never} style={style} className={className}>
      {children}
    </As>

  );
}
