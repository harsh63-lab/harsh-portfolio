"use client";

import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { useInView } from "motion/react";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

gsap.registerPlugin(SplitText);

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  delay?: number;
  id?: string;
  tabIndex?: number;
};

export function LineReveal({ as: Tag = "p", className, children, delay = 0, id, tabIndex }: Props) {
  const ref = useRef<HTMLElement>(null);
  const played = useRef(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;

    if (played.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.setAttribute("data-revealed", "");
      return;
    }

    played.current = true;
    let done = false;
    const split = SplitText.create(el, {
      type: "lines",
      mask: "lines",
      linesClass: "reveal-line",
      autoSplit: true,
      onSplit(self) {
        if (done) return;
        el.setAttribute("data-revealed", "");
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.05,
          ease: "expo.out",
          stagger: 0.075,
          delay,
          onComplete() {
            done = true;
            self.revert();
            el.setAttribute("data-revealed", "");
          },
        });
      },
    });

    return () => {
      split.revert();
      el.setAttribute("data-revealed", "");
    };
  }, [inView, delay]);

  return (
    <Tag ref={ref} className={className} data-reveal="" id={id} tabIndex={tabIndex}>
      {children}
    </Tag>
  );
}
