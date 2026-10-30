"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Exploration } from "@/content/projects";
import { usePreviewPanel } from "../index/usePreviewPanel";
import { scrollToElement } from "../providers/SmoothScroll";
import { useMedia } from "../ui/useMedia";
import { Reveal } from "../work/Reveal";
import { ExplorationPlate } from "./ExplorationPlate";

export const OPEN_EXPLORATION_EVENT = "open-exploration";

/** Ask the Explorations index to open an entry and bring it into view. */
export function openExploration(slug: string) {
  window.dispatchEvent(new CustomEvent(OPEN_EXPLORATION_EVENT, { detail: slug }));
}

const WIPE = { type: "spring", visualDuration: 0.55, bounce: 0 } as const;

// The Index, reworked for interests: rows expand in place (no routes, no
// case studies). On large screens the shared preview panel shows the
// illustration for the hovered entry, or the open one.
export function ExplorationIndex({ items }: { items: Exploration[] }) {
  const wide = useMedia("(min-width: 1024px)");
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLElement>());
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const pendingScroll = useRef<string | null>(null);

  const shownKey = active ?? open;
  const { box, asideRef, panelRef, listRef, y: panelY, scale: panelScale, opacity: panelOpacity } = usePreviewPanel(wide, shownKey, (key) => buttons.current.get(key) ?? null);
  const shownIndex = items.findIndex((e) => e.slug === shownKey);
  const shown = shownIndex >= 0 ? items[shownIndex] : null;

  // Hover is transient; clear it when Next hides this route.
  useLayoutEffect(() => () => setActive(null), []);

  // The Desk can ask for an entry to be opened.
  useEffect(() => {
    const onOpen = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (!items.some((x) => x.slug === slug)) return;
      pendingScroll.current = slug;
      setOpen(slug);
      buttons.current.get(slug)?.focus({ preventScroll: true });
    };
    window.addEventListener(OPEN_EXPLORATION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EXPLORATION_EVENT, onOpen);
  }, [items]);

  // Scroll once the entry has started opening. Motion measures `height: auto`
  // by briefly resizing and then restoring the window scroll, which would
  // cancel a smooth scroll started in the same frame.
  useEffect(() => {
    if (!open || pendingScroll.current !== open) return;
    pendingScroll.current = null;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => {
        const row = rows.current.get(open);
        if (row) scrollToElement(row);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
      <ol ref={listRef} className="index-list border-b border-ink lg:col-span-8" onPointerLeave={() => setActive(null)}>
        {items.map((item, i) => {
          const number = String(i + 1).padStart(2, "0");
          const isOpen = open === item.slug;
          const panelId = `exploration-panel-${item.slug}`;
          const buttonId = `exploration-button-${item.slug}`;
          return (
            <li
              key={item.slug}
              id={`exploration-${item.slug}`}
              ref={(el) => {
                if (el) rows.current.set(item.slug, el);
              }}
              className="relative"
            >
              <Reveal
                as="span"
                effect="rule-in"
                className="absolute inset-x-0 top-0 block h-px bg-ink"
                style={{ ["--d" as string]: `${i * 70}ms` }}
              />
              <h3>
                <button
                  ref={(el) => {
                    if (el) buttons.current.set(item.slug, el);
                  }}
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.slug)}
                  onPointerEnter={() => setActive(item.slug)}
                  onFocus={() => setActive(item.slug)}
                  onBlur={() => setActive(null)}
                  className="index-row group relative grid w-full grid-cols-[2.25rem_1fr_auto] items-start gap-x-4 py-6 text-left md:grid-cols-[3rem_1fr_auto] md:gap-x-6 md:py-8 lg:grid-cols-[3.5rem_1fr_auto] lg:items-baseline"
                  data-open={isOpen || undefined}
                >
                  <span aria-hidden="true" className="index-fill absolute inset-x-0 bottom-0 h-[3px] bg-signal" />
                  <span className="label pt-2 text-ink-muted lg:pt-0">{number}</span>
                  <span className="min-w-0">
                    <span className="index-title block text-[clamp(2rem,4.6vw,4.75rem)] leading-[0.95] tracking-[-0.03em]">
                      {item.title}
                    </span>
                    <span className="label mt-3 block text-ink-muted lg:hidden">{item.kicker}</span>
                  </span>
                  <span className="label flex items-center gap-5 pt-2 text-ink-muted lg:pt-0">
                    <span className="hidden lg:inline">{item.kicker}</span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-9 w-9 items-center justify-center border border-ink transition-colors duration-300 ${
                        isOpen ? "bg-ink text-paper" : "text-ink group-hover:bg-signal group-hover:text-on-signal"
                      }`}
                    >
                      <Plus
                        className={`h-4 w-4 transition-transform duration-300 ease-[var(--ease-out)] ${isOpen ? "rotate-45" : ""}`}
                        strokeWidth={1.75}
                      />
                    </span>
                  </span>
                </button>
              </h3>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.25 } }}
                    transition={{ type: "spring", visualDuration: 0.45, bounce: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-x-6 gap-y-8 pb-12 pt-2 md:grid-cols-[3rem_1fr] lg:grid-cols-[3.5rem_1fr]">
                      <span aria-hidden="true" className="hidden md:block" />
                      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-[1.3fr_1fr]">
                        <p className="font-serif text-lead">{item.summary}</p>
                        <div>
                          <dl className="border-t border-ink">
                            {item.facts.map((f) => (
                              <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-x-4 border-b border-rule py-3">
                                <dt className="label pt-1 text-ink-muted">{f.label}</dt>
                                <dd>{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
                            {item.tags.map((t) => (
                              <li key={t} className="border border-ink px-3 py-1 text-[0.9375rem]">
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="relative aspect-[4/3] w-full max-w-md lg:hidden">
                          <ExplorationPlate kind={item.visual} tone={item.tone} number={number} title={item.title} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      <aside ref={asideRef} aria-hidden="true" className="hidden lg:col-span-4 lg:block">
        {wide && box && (
          <motion.div
            ref={panelRef}
            className="pointer-events-none fixed top-0 z-20"
            style={{ left: box.left, width: box.width, y: panelY, opacity: panelOpacity }}
          >
            <motion.div className="origin-top-right" style={{ scale: panelScale }}>
              <div className="relative aspect-[4/5] w-full overflow-hidden" style={{ maxHeight: box.plateMax }}>
                {items.map((item, i) => (
                  <motion.div
                    key={item.slug}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      clipPath: shownKey === item.slug ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                      scale: shownKey === item.slug ? 1 : 1.06,
                    }}
                    transition={WIPE}
                    style={{ zIndex: shownKey === item.slug ? 2 : 1 }}
                  >
                    <ExplorationPlate kind={item.visual} tone={item.tone} number={String(i + 1).padStart(2, "0")} title={item.title} />
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 border-t border-ink bg-paper pt-3">
                <AnimatePresence mode="wait" initial={false}>
                  {shown && (
                    <motion.div
                      key={shown.slug}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ duration: 0.22 }}
                    >
                      <p className="label flex justify-between text-ink-muted">
                        <span>Exploration {String(shownIndex + 1).padStart(2, "0")}</span>
                        <span>{shown.kicker}</span>
                      </p>
                      <p className="mt-2 text-[0.9375rem] text-ink-muted">{shown.tags.join(" · ")}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </aside>
    </div>
  );
}
