"use client";

import { Pause, Play } from "lucide-react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef, useState } from "react";
import { usePrefersReducedMotion } from "../ui/useMedia";

const BASE_SPEED = 2.2;

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

export function VelocityMarquee({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const offset = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2400, 0, 2400], [-5, 0, 5], { clamp: true });
  const skew = useTransform(smooth, [-2400, 0, 2400], [8, 0, -8], { clamp: true });
  const x = useTransform(() => `${wrap(-50, 0, offset.get())}%`);

  const running = !reduce && !paused && !hovered && inView;

  useAnimationFrame((_, delta) => {
    if (!running) return;
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    const move = direction.current * BASE_SPEED * (delta / 1000) * (1 + Math.abs(b));
    offset.set(offset.get() - move);
  });

  const items = Array.from({ length: 4 }, (_, i) => i);

  return (
    <div>
      <div
        ref={ref}
        className="relative overflow-hidden border-y border-ink bg-ink py-5 text-paper md:py-7"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <p className="sr-only">{text}</p>
        <motion.div aria-hidden="true" className="flex w-max whitespace-nowrap" style={{ x, skewX: reduce ? 0 : skew }}>
          {[0, 1].map((half) => (
            <span key={half} className="flex shrink-0 items-center">
              {items.map((i) => (
                <span key={i} className="flex items-center">
                  <span
                    className="px-6 text-[clamp(2rem,6vw,5rem)] leading-none tracking-[-0.03em] md:px-10"
                    style={{ fontVariationSettings: i % 2 ? '"wght" 300, "wdth" 75' : '"wght" 700, "wdth" 100' }}
                  >
                    {text}
                  </span>
                  <span className="block h-3 w-3 bg-signal md:h-4 md:w-4" />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>
      {!reduce && (
        <div className="shell mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="label inline-flex min-h-11 items-center gap-2 px-2 text-ink-muted transition-colors hover:text-ink"
          >
            {paused ? (
              <Play aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
            ) : (
              <Pause aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
            )}
            {paused ? "Play motion" : "Pause motion"}
          </button>
        </div>
      )}
    </div>
  );
}
