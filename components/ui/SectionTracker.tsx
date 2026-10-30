"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setSection } from "./sectionStore";

// Wraps one page's content and tracks only the [data-folio] sections inside
// it. Next keeps recently visited routes mounted but hidden (React Activity),
// so a document-wide query would also count the hidden page's sections.
export function SectionTracker({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;
    const sections = Array.from(scope.querySelectorAll<HTMLElement>("[data-folio]"));
    if (!sections.length) return;
    const total = sections.length;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setSection({
            id: el.id,
            number: el.dataset.folio ?? "",
            label: el.dataset.folioLabel ?? "",
            total,
          });
        }
      },
      { rootMargin: "-45% 0px -55% 0px" },
    );

    for (const s of sections) observer.observe(s);
    return () => {
      observer.disconnect();
      setSection(null);
    };
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
