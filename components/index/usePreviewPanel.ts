"use client";

import { animate, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const SPRING = { stiffness: 260, damping: 32, mass: 0.8 };

// The large-screen preview panel shared by the index lists. It lives in its
// own column (never over text), follows the shown row vertically, and is
// clamped — or scaled down — so the whole panel always stays on screen.
export function usePreviewPanel(wide: boolean, shownKey: string | null, getRow: (key: string) => HTMLElement | null) {
  const [box, setBox] = useState<{ left: number; width: number; plateMax: number } | null>(null);
  const asideRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const shown = useRef(false);
  const ty = useMotionValue(0);
  const y = useSpring(ty, SPRING);
  const tscale = useMotionValue(1);
  const scale = useSpring(tscale, SPRING);
  const opacity = useMotionValue(0);
  const getRowRef = useRef(getRow);
  useLayoutEffect(() => {
    getRowRef.current = getRow;
  });

  useLayoutEffect(() => {
    const aside = asideRef.current;
    if (!wide || !aside) return;
    const measure = () => {
      const r = aside.getBoundingClientRect();
      const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
      setBox({ left: r.left, width: r.width, plateMax: Math.max(220, window.innerHeight - nav - 190) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(aside);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [wide]);

  const place = useCallback(() => {
    const row = shownKey ? getRowRef.current(shownKey) : null;
    const panel = panelRef.current;
    const list = listRef.current;
    if (!row || !panel || !list) return;
    const r = row.getBoundingClientRect();
    const h = panel.offsetHeight;
    const nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 64;
    const lr = list.getBoundingClientRect();
    const minTop = Math.max(nav + 16, lr.top);
    const maxView = window.innerHeight - h - 16;
    // Never below the list's bottom edge: once the list scrolls away, the
    // panel rides out with it instead of floating over the next section.
    const maxList = lr.bottom - h;
    let target: number;
    let fit = 1;
    if (maxList < minTop) {
      target = maxList;
    } else if (maxView >= minTop) {
      target = Math.min(Math.max(r.top + r.height / 2 - h / 2, minTop), Math.min(maxView, maxList));
    } else {
      target = minTop;
      fit = Math.max(0.3, (window.innerHeight - 16 - minTop) / h);
    }
    ty.set(target);
    tscale.set(fit);
    if (!shown.current) {
      y.jump(target);
      scale.jump(fit);
      shown.current = true;
    }
  }, [shownKey, ty, y, tscale, scale]);

  useEffect(() => {
    const c = animate(opacity, shownKey ? 1 : 0, { duration: shownKey ? 0.25 : 0.18 });
    return () => c.stop();
  }, [shownKey, opacity]);

  useEffect(() => {
    if (!shownKey || !wide) {
      shown.current = false;
      return;
    }
    place();
    window.addEventListener("scroll", place, { passive: true });
    window.addEventListener("resize", place);
    // Rows can change height (expanding), so re-place briefly after updates.
    const id = window.setInterval(place, 120);
    const stop = window.setTimeout(() => window.clearInterval(id), 900);
    return () => {
      window.removeEventListener("scroll", place);
      window.removeEventListener("resize", place);
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [shownKey, wide, place]);

  // Next hides visited routes instead of unmounting them: drop the panel
  // instantly so it isn't still showing when the visitor returns.
  useLayoutEffect(
    () => () => {
      opacity.jump(0);
      shown.current = false;
    },
    [opacity],
  );

  return { box, asideRef, panelRef, listRef, y, scale, opacity };
}
