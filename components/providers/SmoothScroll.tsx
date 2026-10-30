"use client";

import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Jump to the top immediately (used when a new page mounts). */
export function resetScroll() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  instance?.scrollTo(0, { immediate: true, force: true });
}

/** Smooth-scroll an element into view below the nav (Lenis-aware). */
export function scrollToElement(target: HTMLElement, offset = -96) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance) {
    instance.scrollTo(target, { offset, duration: 1.1 });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }
}

export function scrollToTarget(target: HTMLElement) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance) {
    instance.scrollTo(target, { offset: 0, duration: 1.1 });
  } else {
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  target.focus({ preventScroll: true });
}

// Lenis is stepped from Motion's frame loop ("setup" runs before Motion reads
// scroll), so smooth scrolling and every useScroll-driven value share one rAF.
function step({ timestamp }: { timestamp: number }) {
  instance?.raf(timestamp);
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    const sync = () => {
      const wanted = fine.matches && !reduce.matches;
      if (wanted && !instance) {
        instance = new Lenis({ autoRaf: false, lerp: 0.12, smoothWheel: true, syncTouch: false });
        frame.setup(step, true);
      } else if (!wanted && instance) {
        cancelFrame(step);
        instance.destroy();
        instance = null;
      }
    };

    sync();
    reduce.addEventListener("change", sync);
    fine.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      fine.removeEventListener("change", sync);
      cancelFrame(step);
      instance?.destroy();
      instance = null;
    };
  }, []);

  useEffect(() => {
    instance?.resize();
  }, [pathname]);

  return null;
}
