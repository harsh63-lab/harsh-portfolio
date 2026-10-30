"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ViewTransition, useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";
import { Cover } from "../work/Cover";
import { Reveal } from "../work/Reveal";
import { useMedia } from "../ui/useMedia";
import { usePreviewPanel } from "./usePreviewPanel";

const WIPE = { type: "spring", visualDuration: 0.55, bounce: 0 } as const;
// Covers morph only on the navigations they belong to (see Link transitionTypes).
const MORPH = { "open-project": "morph", "back-to-index": "morph", default: "none" };

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const wide = useMedia("(min-width: 1024px)");
  const [active, setActive] = useState<string | null>(null);
  const rows = useRef(new Map<string, HTMLElement>());
  const { box, asideRef, panelRef, listRef, y: panelY, scale: panelScale, opacity: panelOpacity } = usePreviewPanel(wide, active, (key) => rows.current.get(key) ?? null);
  const activeIndex = projects.findIndex((p) => p.slug === active);
  const current = activeIndex >= 0 ? projects[activeIndex] : null;

  // Hover/focus state is transient: clear it when Next hides this route.
  useLayoutEffect(() => () => setActive(null), []);

  function activate(slug: string, el: HTMLElement) {
    rows.current.set(slug, el);
    setActive(slug);
  }

  return (
    <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-12">
      <ol ref={listRef} className="index-list border-b border-ink lg:col-span-8" onPointerLeave={() => setActive(null)}>
        {projects.map((project, i) => {
          const number = String(i + 1).padStart(2, "0");
          return (
            <li key={project.slug} className="relative">
              <Reveal
                as="span"
                effect="rule-in"
                className="absolute inset-x-0 top-0 block h-px bg-ink"
                style={{ ["--d" as string]: `${i * 70}ms` }}
              />
              <Link
                href={`/work/${project.slug}`}
                prefetch
                transitionTypes={["open-project"]}
                className="index-row group relative grid grid-cols-[2.25rem_1fr] items-start gap-x-4 gap-y-4 py-6 md:grid-cols-[3rem_1fr_11rem] md:gap-x-6 md:py-8 lg:grid-cols-[3.5rem_1fr_auto] lg:items-baseline"
                onPointerEnter={(e) => activate(project.slug, e.currentTarget)}
                onFocus={(e) => activate(project.slug, e.currentTarget)}
                onBlur={() => setActive(null)}
              >
                <span aria-hidden="true" className="index-fill absolute inset-x-0 bottom-0 h-[3px] bg-signal" />
                <span className="label pt-2 text-ink-muted lg:pt-0">{number}</span>
                <span className="min-w-0">
                  <span className="index-title block text-[clamp(2rem,4.6vw,4.75rem)] leading-[0.95] tracking-[-0.03em]">
                    {project.title}
                  </span>
                  <span className="label mt-3 block text-ink-muted lg:hidden">
                    {project.category} · {project.year}
                  </span>
                  <span className="mt-3 hidden max-w-[46ch] text-ink-muted md:block lg:hidden">{project.summary}</span>
                </span>
                <span className="label hidden items-center gap-5 text-ink-muted lg:flex">
                  <span>{project.category}</span>
                  <span>{project.year}</span>
                  <ArrowUpRight aria-hidden="true" className="index-arrow h-5 w-5 text-ink" strokeWidth={1.5} />
                </span>
                <span className="col-span-2 block md:col-span-1 lg:hidden">
                  <span className="relative block aspect-[4/3] w-full overflow-hidden">
                    {wide ? (
                      <span className="absolute inset-0 block">
                        <Cover project={project} index={i} size="sm" sizes="40vw" decorative still />
                      </span>
                    ) : (
                      <ViewTransition name={`cover-${project.slug}`} share={MORPH} default="none">
                        <span className="absolute inset-0 block transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]">
                          <Cover project={project} index={i} size="sm" sizes="(min-width: 768px) 176px, 100vw" decorative still />
                        </span>
                      </ViewTransition>
                    )}
                  </span>
                  <span className="mt-3 block text-ink-muted md:hidden">{project.summary}</span>
                </span>
              </Link>
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
              {projects.map((project, i) => (
                <motion.div
                  key={project.slug}
                  className="absolute inset-0"
                  initial={false}
                  animate={{
                    clipPath: active === project.slug ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                    scale: active === project.slug ? 1 : 1.06,
                  }}
                  transition={WIPE}
                  style={{ zIndex: active === project.slug ? 2 : 1 }}
                >
                  {active === project.slug ? (
                    // Only the visible plate takes part in the morph; hidden
                    // plates would otherwise pair up and flash during navigation.
                    <ViewTransition name={`cover-${project.slug}`} share={MORPH} default="none">
                      <div className="absolute inset-0">
                        <Cover project={project} index={i} size="sm" sizes="34vw" decorative still />
                      </div>
                    </ViewTransition>
                  ) : (
                    <div className="absolute inset-0">
                      <Cover project={project} index={i} size="sm" sizes="34vw" decorative still />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="mt-4 border-t border-ink bg-paper pt-3">
              <AnimatePresence mode="wait" initial={false}>
                {current && (
                  <motion.div
                    key={current.slug}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.22 }}
                  >
                    <p className="label flex justify-between text-ink-muted">
                      <span>Entry {String(activeIndex + 1).padStart(2, "0")}</span>
                      <span>
                        {current.category} · {current.year}
                      </span>
                    </p>
                    <p className="mt-2 line-clamp-3 text-[0.9375rem] text-ink-muted">{current.summary}</p>
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
