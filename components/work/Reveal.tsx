"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

// Marks an element as shown once it enters the viewport; the visual effect
// (.wipe or .fade-up) is a CSS transition keyed off `data-shown`.
export function Reveal({
  as: Tag = "div",
  effect,
  className = "",
  children,
  style,
}: {
  as?: ElementType;
  effect: "wipe" | "fade-up" | "rule-in";
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  useEffect(() => {
    if (inView) ref.current?.setAttribute("data-shown", "");
  }, [inView]);

  return (
    <Tag ref={ref} className={`${effect} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
