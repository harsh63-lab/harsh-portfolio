"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "../ui/useMedia";

export function CoverParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { scale, y }}>
        {children}
      </motion.div>
    </div>
  );
}

export function SectionProgress() {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  return (
    <span ref={ref} aria-hidden="true" className="absolute inset-x-0 top-0 block h-[3px] bg-rule">
      <motion.span className="block h-full origin-left bg-signal" style={{ scaleX: scrollYProgress }} />
    </span>
  );
}
