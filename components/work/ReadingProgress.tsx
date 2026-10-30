"use client";

import { motion, useScroll } from "motion/react";
import { useLayoutEffect, useRef } from "react";
import { resetScroll } from "../providers/SmoothScroll";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-[var(--nav-h)] z-40 h-[2px] origin-left bg-signal"
      style={{ scaleX: scrollYProgress }}
    />
  );
}

// A newly opened case study starts at its title. Next keeps the previous
// scroll offset when it still fits inside the new page, which would open long
// case studies mid-way. Runs before the view-transition snapshot is taken.
export function FocusOnMount({ targetId }: { targetId: string }) {
  const done = useRef(false);
  useLayoutEffect(() => {
    if (done.current) return;
    done.current = true;
    if (!window.location.hash) resetScroll();
    document.getElementById(targetId)?.focus({ preventScroll: true });
  }, [targetId]);
  return null;
}
