"use client";

import { ArrowRight } from "lucide-react";
import { motion, useScroll } from "motion/react";
import Link from "next/link";
import { ViewTransition, useRef } from "react";
import type { Project } from "@/content/projects";
import { Cover } from "./Cover";

export function NextProject({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  return (
    <section
      ref={ref}
      id="next"
      data-folio="→"
      data-folio-label="Next project"
      aria-label="Next project"
      className="relative"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 block h-[3px] bg-rule">
        <motion.span className="block h-full origin-left bg-signal" style={{ scaleX: scrollYProgress }} />
      </span>
      <Link
        href={`/work/${project.slug}`}
        prefetch
        transitionTypes={["next-project"]}
        className="next-link shell group grid grid-cols-4 items-end gap-x-6 gap-y-8 py-16 md:grid-cols-12 md:py-28"
      >
        <span className="col-span-4 md:col-span-8">
          <span className="label flex items-center gap-3 text-ink-muted">
            Next — {String(index + 1).padStart(2, "0")}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.75} />
          </span>
          <span className="next-title t-display mt-6 block transition-colors group-hover:text-signal-text">{project.title}</span>
          <span className="label mt-6 block text-ink-muted">
            {project.category} · {project.year}
          </span>
        </span>
        <span className="col-span-2 block md:col-span-3 md:col-start-10">
          <span className="relative block aspect-[4/5] w-full overflow-hidden">
            <ViewTransition name={`cover-${project.slug}`} share={{ "next-project": "morph", default: "none" }} default="none">
              <span className="absolute inset-0 block transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]">
                <Cover project={project} index={index} size="sm" sizes="25vw" decorative still />
              </span>
            </ViewTransition>
          </span>
        </span>
      </Link>
    </section>
  );
}
