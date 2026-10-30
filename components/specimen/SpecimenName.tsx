"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { usePrefersReducedMotion } from "../ui/useMedia";

// Hero treatment: tall hairline capitals that swell to heavy condensed under
// the cursor. Weight adds width, so the rest state is set wider (wdth 88) and
// the peak narrower (wdth 75): both occupy almost the same footprint, so
// letters trade lightness for weight without crowding their neighbours.
const HAIR = { wght: 520, wdth: 75 }; // entrance: letters rise set medium-condensed…
const REST = { wght: 200, wdth: 88 }; // …and settle into the hairline
const PEAK = { wght: 800, wdth: 75 };
const FAR = -1e6;
const LINE_HEIGHT = 0.86;
const TRACKING = "-0.012em";
const SPRING = { stiffness: 210, damping: 24, mass: 0.6 };
const REST_FVS = `"wght" ${REST.wght}, "wdth" ${REST.wdth}, "opsz" 96`;

// Entrance timeline, in seconds. One motion value drives every letter.
const STAGGER = 0.045;
const RISE = 0.85;
const SET_DELAY = 0.28;
const SET = 0.95;

type Point = { x: number; y: number };
type Bounds = { left: number; right: number; top: number; bottom: number };

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function settings(intro: number, v: number) {
  const w = HAIR.wght + (REST.wght - HAIR.wght) * intro;
  const d = HAIR.wdth + (REST.wdth - HAIR.wdth) * intro;
  return `"wght" ${w + (PEAK.wght - w) * v}, "wdth" ${d + (PEAK.wdth - d) * v}, "opsz" 96`;
}

function proximity(x: number, y: number, c: Point | undefined, r: number) {
  if (!c) return 0;
  const dx = x - c.x;
  const dy = (y - c.y) * 1.25;
  const t = 1 - Math.sqrt(dx * dx + dy * dy) / r;
  return t <= 0 ? 0 : t * t * (3 - 2 * t);
}

function ring(origin: Point, c: Point | undefined, radius: number, amp: number, sigma: number) {
  if (!c || amp <= 0.001) return 0;
  const dx = c.x - origin.x;
  const dy = c.y - origin.y;
  const off = Math.sqrt(dx * dx + dy * dy) - radius;
  return amp * Math.exp(-(off * off) / (2 * sigma * sigma));
}

type Specimen = {
  px: MotionValue<number>;
  py: MotionValue<number>;
  time: MotionValue<number>;
  rippleR: MotionValue<number>;
  rippleAmp: MotionValue<number>;
  originRef: RefObject<Point>;
  centersRef: RefObject<Point[]>;
  radiusRef: RefObject<number>;
};

const SpecimenContext = createContext<Specimen | null>(null);

function useSpecimen() {
  const ctx = useContext(SpecimenContext);
  if (!ctx) throw new Error("SpecimenName must be used inside SpecimenProvider");
  return ctx;
}

function strength(s: Specimen, c: Point | undefined) {
  const r = s.radiusRef.current;
  const a = proximity(s.px.get(), s.py.get(), c, r);
  const b = ring(s.originRef.current, c, s.rippleR.get(), s.rippleAmp.get(), r * 0.42);
  return a > b ? a : b;
}

export function SpecimenProvider({ children }: { children: ReactNode }) {
  const px = useMotionValue(FAR);
  const py = useMotionValue(FAR);
  const time = useMotionValue(0);
  const rippleR = useMotionValue(0);
  const rippleAmp = useMotionValue(0);
  const originRef = useRef<Point>({ x: FAR, y: FAR });
  const centersRef = useRef<Point[]>([]);
  const radiusRef = useRef(320);
  const [value] = useState<Specimen>(() => ({ px, py, time, rippleR, rippleAmp, originRef, centersRef, radiusRef }));
  return <SpecimenContext.Provider value={value}>{children}</SpecimenContext.Provider>;
}

function pageOffset(el: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) {
    x += n.offsetLeft;
    y += n.offsetTop;
  }
  return { x, y };
}

function fitSize(root: HTMLElement, probe: HTMLElement, linesKey: string) {
  const words = linesKey.split("\n");
  let widest = 0;
  for (const word of words) {
    probe.textContent = word;
    for (const v of [0, 1]) {
      probe.style.fontVariationSettings = settings(1, v);
      widest = Math.max(widest, probe.getBoundingClientRect().width);
    }
  }
  if (!widest) return null;
  const byWidth = (root.clientWidth * 100) / (widest * 1.04);
  const byHeight = (window.innerHeight * 0.52) / (words.length * LINE_HEIGHT);
  return Math.round(Math.max(40, Math.min(byWidth, byHeight, 352)) * 10) / 10;
}

// Uses layout offsets rather than getBoundingClientRect so in-flight
// transforms (the entrance rise, the scroll drift) never skew the centres.
function measureLetters(
  root: HTMLElement,
  els: (HTMLElement | null)[],
  centersRef: RefObject<Point[]>,
  radiusRef: RefObject<number>,
  boundsRef: RefObject<Bounds>,
) {
  const base = pageOffset(root);
  const b: Bounds = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
  const next: Point[] = [];
  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    if (!el) continue;
    const line = el.parentElement!;
    const left = base.x + line.offsetLeft + el.offsetLeft;
    const top = base.y + line.offsetTop + el.offsetTop;
    next[i] = { x: left + el.offsetWidth / 2, y: top + el.offsetHeight / 2 };
    if (left < b.left) b.left = left;
    if (left + el.offsetWidth > b.right) b.right = left + el.offsetWidth;
    if (top < b.top) b.top = top;
    if (top + el.offsetHeight > b.bottom) b.bottom = top + el.offsetHeight;
  }
  centersRef.current = next;
  boundsRef.current = b;
  radiusRef.current = (parseFloat(getComputedStyle(root).fontSize) || 200) * 1.15;
}

// `lines`: the name as it should be set, one entry per line.
export function SpecimenName({ lines }: { lines: string[] }) {
  const specimen = useSpecimen();
  const { px, py, time, rippleR, rippleAmp, originRef, centersRef, radiusRef } = specimen;
  const words = lines.map((l) => l.trim().replace(/\s+/g, "\u00a0")).filter(Boolean);
  const wordsKey = words.join("\n");
  const longest = Math.max(...words.map((w) => w.length), 1);
  const total = words.reduce((n, w) => n + w.length, 0);
  const introEnd = (total - 1) * STAGGER + SET_DELAY + SET;

  const rootRef = useRef<HTMLSpanElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const letterEls = useRef<(HTMLSpanElement | null)[]>([]);
  const boundsRef = useRef<Bounds>({ left: 0, right: 0, top: 0, bottom: 0 });

  const reduce = usePrefersReducedMotion();
  const [fontSize, setFontSize] = useState<number | null>(null);
  const [introDone, setIntroDone] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const ready = fontSize != null && fontsReady;

  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 900], [0, -90], { clamp: true });

  useLayoutEffect(() => {
    const root = rootRef.current;
    const probe = probeRef.current;
    if (!root || !probe) return;
    const fit = () => {
      const size = fitSize(root, probe, wordsKey);
      if (size) setFontSize(size);
    };
    fit();
    let cancelled = false;
    // `document.fonts.status` can read "loaded" before a hidden element has
    // even requested its font, so load this exact face explicitly. Then refit
    // and mark ready in one render: the reveal below always follows the final
    // real-font size.
    const family = getComputedStyle(root).fontFamily;
    const done = () => {
      if (cancelled) return;
      fit();
      setFontsReady(true);
    };
    if (document.fonts?.load) document.fonts.load(`300 100px ${family}`, wordsKey).then(done, done);
    else Promise.resolve().then(done);
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [wordsKey]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (fontSize == null || !root) return;
    measureLetters(root, letterEls.current, centersRef, radiusRef, boundsRef);
    if (!fontsReady) return;
    // Reveal one frame after the final (real-font) size is laid out, so the
    // name can never resize while it's visible.
    const id = requestAnimationFrame(() => root.setAttribute("data-ready", ""));
    return () => cancelAnimationFrame(id);
  }, [fontSize, fontsReady, centersRef, radiusRef]);

  // Entrance: letters rise as hairlines, set to their regular weight, then a
  // weight wave sweeps the line. Plays once per mount; pointer movement takes over.
  useEffect(() => {
    if (!ready) return;
    if (reduce) {
      time.jump(introEnd);
      return;
    }
    const sweepTo = (s: number) => {
      const b = boundsRef.current;
      const r = radiusRef.current;
      px.set(b.left - r + (b.right - b.left + 2 * r) * s);
      py.set(b.top + (b.bottom - b.top) * s);
    };
    const finish = () => {
      px.set(FAR);
      py.set(FAR);
      setIntroDone(true);
    };
    const setIn = animate(time, introEnd, { duration: introEnd, ease: "linear" });
    const sweep = animate(0, 1, {
      duration: 1.5,
      delay: Math.max(0.6, introEnd - 0.7),
      ease: [0.65, 0, 0.35, 1],
      onUpdate: sweepTo,
      onComplete: finish,
    });
    const interrupt = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sweep.stop();
      setIntroDone(true);
    };
    window.addEventListener("pointermove", interrupt, { passive: true });
    return () => {
      setIn.stop();
      sweep.stop();
      window.removeEventListener("pointermove", interrupt);
    };
  }, [ready, reduce, introEnd, time, px, py, radiusRef]);

  // Ongoing interaction: cursor proximity on fine pointers; a scroll-linked
  // weight wave on touch screens.
  useEffect(() => {
    if (!ready || reduce || !introDone) return;
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let visible = true;

    const rest = () => {
      px.set(FAR);
      py.set(FAR);
    };
    const onMove = (e: PointerEvent) => {
      if (!visible || e.pointerType !== "mouse") return;
      px.set(e.pageX);
      py.set(e.pageY);
    };
    const onScroll = () => {
      if (!visible) return;
      const b = boundsRef.current;
      const r = radiusRef.current;
      const s = Math.min(1, window.scrollY / Math.max(1, root.offsetHeight * 1.6));
      if (s <= 0) return rest();
      px.set(b.left - r + (b.right - b.left + 2 * r) * s);
      py.set(b.top + (b.bottom - b.top) * s);
    };
    const onResize = () => measureLetters(root, letterEls.current, centersRef, radiusRef, boundsRef);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && fine) rest();
    });
    io.observe(root);

    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", rest);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", rest);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ready, reduce, introDone, px, py, centersRef, radiusRef]);

  function strike(e: ReactPointerEvent<HTMLSpanElement>) {
    if (reduce || !ready) return;
    originRef.current = { x: e.pageX, y: e.pageY };
    const b = boundsRef.current;
    const reach = Math.hypot(b.right - b.left, b.bottom - b.top) + radiusRef.current;
    rippleR.jump(0);
    rippleAmp.jump(1);
    animate(rippleR, reach, { duration: 1.8, ease: [0.33, 1, 0.68, 1] });
    animate(rippleAmp, 0, { duration: 1.8, ease: [0.55, 0, 1, 0.45] });
  }

  const initialSize = `min(22rem, ${(88 / (longest * 0.6)).toFixed(2)}vw)`;
  let cursor = 0;

  return (
    <motion.span
      ref={rootRef}
      aria-hidden="true"
      onPointerDown={strike}
      data-intro={introDone || reduce ? undefined : ""}
      className="specimen-name relative block w-full cursor-crosshair select-none font-sans text-ink [-webkit-tap-highlight-color:transparent]"
      style={{
        fontSize: fontSize ? `${fontSize}px` : initialSize,
        lineHeight: LINE_HEIGHT,
        letterSpacing: TRACKING,
        contain: "layout style",
        y: reduce ? 0 : drift,
      }}
    >
      <span
        ref={probeRef}
        className="pointer-events-none invisible absolute left-0 top-0 whitespace-nowrap"
        style={{ fontSize: "100px", letterSpacing: TRACKING, transition: "none" }}
      />
      {words.map((word, w) => (
        <span
          key={`${word}-${w}`}
          className={`specimen-line relative block whitespace-nowrap ${w % 2 === 1 ? "md:text-right" : ""}`}
        >
          {Array.from(word).map((char) => {
            const i = cursor++;
            const setEl = (el: HTMLSpanElement | null) => {
              letterEls.current[i] = el;
            };
            return reduce ? (
              // Same fixed-slot structure as the animated letters, so switching
              // to reduced motion never changes the layout.
              <span key={i} ref={setEl} className="relative inline-block">
                <span className="invisible" style={{ fontVariationSettings: REST_FVS }}>
                  {char}
                </span>
                <span
                  className="absolute left-1/2 top-0 inline-block -translate-x-1/2 whitespace-nowrap"
                  style={{ fontVariationSettings: settings(1, total > 1 ? (i / (total - 1)) * 0.9 : 0) }}
                >
                  {char}
                </span>
              </span>
            ) : (
              <Letter key={i} char={char} index={i} setEl={setEl} specimen={specimen} />
            );
          })}
        </span>
      ))}
    </motion.span>
  );
}

function Letter({
  char,
  index,
  setEl,
  specimen,
}: {
  char: string;
  index: number;
  setEl: (el: HTMLSpanElement | null) => void;
  specimen: Specimen;
}) {
  const { time, centersRef } = specimen;
  const p = useTransform(() => strength(specimen, centersRef.current[index]));
  const s = useSpring(p, SPRING);
  const start = index * STAGGER;
  const y = useTransform(() => `${(1 - easeOutExpo(clamp01((time.get() - start) / RISE))) * 108}%`);
  const fvs = useTransform(() => settings(easeInOut(clamp01((time.get() - start - SET_DELAY) / SET)), s.get()));

  // Each glyph sits in a fixed slot sized by an invisible copy at rest weight.
  // The animated glyph is absolutely centred with a transform, so changing its
  // weight and width never reflows neighbouring letters (no layout shift).
  return (
    <span ref={setEl} className="relative inline-block">
      <span className="invisible" style={{ fontVariationSettings: REST_FVS }}>
        {char}
      </span>
      <motion.span
        className="absolute left-1/2 top-0 inline-block -translate-x-1/2 whitespace-nowrap"
        style={{ y, fontVariationSettings: fvs }}
      >
        {char}
      </motion.span>
    </span>
  );
}

export function SpecimenReadout() {
  const specimen = useSpecimen();
  const { centersRef } = specimen;
  const reduce = usePrefersReducedMotion();
  const peak = useTransform(() => {
    // Read every input up front: function-form useTransform subscribes only to
    // values read on its first run, when the letter list may still be empty.
    specimen.px.get();
    specimen.py.get();
    specimen.rippleR.get();
    specimen.rippleAmp.get();
    const list = centersRef.current;
    let max = 0;
    for (let i = 0; i < list.length; i++) {
      const v = strength(specimen, list[i]);
      if (v > max) max = v;
    }
    return max;
  });
  const s = useSpring(peak, SPRING);
  const weight = useTransform(() => String(Math.round(REST.wght + (PEAK.wght - REST.wght) * s.get())));
  const width = useTransform(() => String(Math.round(REST.wdth + (PEAK.wdth - REST.wdth) * s.get())));

  if (reduce) {
    return (
      <span>
        Wt {REST.wght}–{PEAK.wght} · Wd {PEAK.wdth}–{REST.wdth}
      </span>
    );
  }

  return (
    <span>
      Wt <motion.span className="inline-block min-w-[3ch] text-ink">{weight}</motion.span>
      {" · "}Wd <motion.span className="inline-block min-w-[3ch] text-ink">{width}</motion.span>
    </span>
  );
}
