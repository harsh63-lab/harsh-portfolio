"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Artifact } from "@/content/desk";
import { explorations, getProject } from "@/content/projects";
import { openExploration } from "../explorations/ExplorationIndex";
import { useFinePointer, usePrefersReducedMotion } from "../ui/useMedia";
import { DeskCard, type CardTarget, type Mover } from "./DeskCard";
import { BASE_SIZE } from "./sizes";

type Mode = "scatter" | "tidy";
type Size = { w: number; h: number };

const PAD = 24;
const GAP = 16;

// Push overlapping cards apart until each pair overlaps by at most `allow`
// of the smaller card — a desk that looks scattered but stays readable.
function relax(targets: CardTarget[], sizes: Size[], width: number, height: number, allow = 0.22) {
  const pts = targets.map((t) => ({ ...t }));
  for (let iter = 0; iter < 80; iter++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i];
        const b = pts[j];
        const ox = Math.min(a.x + sizes[i].w, b.x + sizes[j].w) - Math.max(a.x, b.x);
        const oy = Math.min(a.y + sizes[i].h, b.y + sizes[j].h) - Math.max(a.y, b.y);
        if (ox <= 0 || oy <= 0) continue;
        const limitX = Math.min(sizes[i].w, sizes[j].w) * allow;
        const limitY = Math.min(sizes[i].h, sizes[j].h) * allow;
        if (ox <= limitX || oy <= limitY) continue;
        moved = true;
        if (ox - limitX < oy - limitY) {
          const push = (ox - limitX) / 2 + 1;
          const dir = a.x + sizes[i].w / 2 < b.x + sizes[j].w / 2 ? -1 : 1;
          a.x += dir * push;
          b.x -= dir * push;
        } else {
          const push = (oy - limitY) / 2 + 1;
          const dir = a.y + sizes[i].h / 2 < b.y + sizes[j].h / 2 ? -1 : 1;
          a.y += dir * push;
          b.y -= dir * push;
        }
      }
    }
    for (let i = 0; i < pts.length; i++) {
      pts[i].x = Math.min(Math.max(PAD, pts[i].x), width - PAD - sizes[i].w);
      pts[i].y = Math.min(Math.max(PAD, pts[i].y), height - PAD - sizes[i].h);
    }
    if (!moved) break;
  }
  return pts;
}

function layout(artifacts: Artifact[], width: number, mode: Mode) {
  const scale = Math.min(1, Math.max(0.58, width / 1100));
  const sizes: Size[] = artifacts.map((a) => ({ w: BASE_SIZE[a.kind].w * scale, h: BASE_SIZE[a.kind].h * scale }));

  if (mode === "scatter") {
    if (width < 640) {
      // Narrow desks: a loose, jittered two-column pile instead of the wide layout.
      const rows = Math.ceil(artifacts.length / 2);
      const rowH = Math.max(...sizes.map((s) => s.h)) * 0.86;
      const height = Math.round(PAD * 2 + rows * rowH + rowH * 0.25);
      const colW = (width - PAD * 2) / 2;
      const seed: CardTarget[] = artifacts.map((a, i) => ({
        x: PAD + (i % 2) * colW + Math.max(0, colW - sizes[i].w) * (0.15 + 0.7 * a.scatter.x),
        y: PAD + Math.floor(i / 2) * rowH + rowH * 0.25 * a.scatter.y,
        rotate: a.scatter.rotate,
        scale: 1,
      }));
      return { height, targets: relax(seed, sizes, width, height, 0.3), sizes };
    }
    const height = Math.round(Math.min(720, Math.max(580, width * 0.52)));
    const seed: CardTarget[] = artifacts.map((a, i) => ({
      x: PAD + (width - PAD * 2 - sizes[i].w) * a.scatter.x,
      y: PAD + (height - PAD * 2 - sizes[i].h) * a.scatter.y,
      rotate: a.scatter.rotate,
      scale: 1,
    }));
    return { height, targets: relax(seed, sizes, width, height), sizes };
  }

  const cols = width < 640 ? 2 : width < 1024 ? 3 : 4;
  const slotW = (width - PAD * 2 - GAP * (cols - 1)) / cols;
  const fit = sizes.map((s) => Math.min(1, (slotW * 0.94) / s.w));
  const rows: number[] = [];
  artifacts.forEach((_, i) => {
    const r = Math.floor(i / cols);
    rows[r] = Math.max(rows[r] ?? 0, sizes[i].h * fit[i]);
  });
  const rowTop: number[] = [];
  let acc = PAD;
  for (let r = 0; r < rows.length; r++) {
    rowTop[r] = acc;
    acc += rows[r] + GAP;
  }
  const height = Math.round(acc - GAP + PAD);
  const targets: CardTarget[] = artifacts.map((_, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const cx = PAD + c * (slotW + GAP) + slotW / 2;
    const cy = rowTop[r] + rows[r] / 2;
    return { x: cx - sizes[i].w / 2, y: cy - sizes[i].h / 2, rotate: 0, scale: fit[i] };
  });
  return { height, targets, sizes };
}

export function Desk({ artifacts }: { artifacts: Artifact[] }) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const fine = useFinePointer();
  const helpId = useId();
  const [chosen, setChosen] = useState<Mode | null>(null);
  const mode: Mode = chosen ?? (reduce ? "tidy" : "scatter");
  const [width, setWidth] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const z = useRef(10);
  const movers = useRef(new Map<string, Mover>());
  const inView = useInView(surfaceRef, { once: true, margin: "0px 0px -20% 0px" });

  useLayoutEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const result = width ? layout(artifacts, width, mode) : null;
  const bringToFront = useCallback(() => ++z.current, []);
  const register = useCallback((id: string, mover: Mover | null) => {
    if (mover) movers.current.set(id, mover);
    else movers.current.delete(id);
  }, []);

  const measured = result != null;
  useEffect(() => {
    if (inView && measured) surfaceRef.current?.setAttribute("data-entered", "");
  }, [inView, measured]);

  const selectedIndex = artifacts.findIndex((a) => a.id === selected);
  const selectedArtifact = selectedIndex >= 0 ? artifacts[selectedIndex] : null;
  const placing = mode === "scatter" && selectedArtifact != null;
  const selectedProject = selectedArtifact?.project ? getProject(selectedArtifact.project) : undefined;
  const selectedExploration = selectedArtifact?.exploration
    ? explorations.find((e) => e.slug === selectedArtifact.exploration)
    : undefined;

  function placeSelected(e: MouseEvent<HTMLDivElement>) {
    if (!placing || !result || (e.target as HTMLElement).closest(".desk-card")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const size = result.sizes[selectedIndex];
    movers.current.get(selectedArtifact.id)?.(e.clientX - rect.left - size.w / 2, e.clientY - rect.top - size.h / 2);
  }

  const help =
    mode === "tidy"
      ? "Tidied · Select a card to read its caption"
      : fine
        ? "Drag to move · Or select a card, then click the desk · Arrow keys nudge"
        : "Hold a card to pick it up · Or tap a card, then tap the desk";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <p id={helpId} className="label max-w-[60ch] text-ink-muted">
          {help}
        </p>
        <button
          type="button"
          onClick={() => setChosen(mode === "scatter" ? "tidy" : "scatter")}
          aria-pressed={mode === "tidy"}
          className={`label press inline-flex min-h-11 items-center gap-3 border border-ink px-4 py-2 ${
            mode === "tidy" ? "bg-ink text-paper" : "hover:bg-ink hover:text-paper"
          }`}
        >
          <span aria-hidden="true" className="grid grid-cols-2 gap-[2px]">
            {[0, 1, 2, 3].map((n) => (
              <span
                key={n}
                className="block h-[5px] w-[5px] bg-current transition-transform duration-300"
                style={{ transform: mode === "tidy" ? "none" : `rotate(${n % 2 ? 18 : -14}deg) translate(${n % 2 ? 1 : -1}px, 0)` }}
              />
            ))}
          </span>
          Tidy up
        </button>
      </div>

      <div
        ref={surfaceRef}
        onClick={placeSelected}
        className={`desk-surface relative flex flex-wrap gap-4 overflow-hidden bg-paper-2 p-4 transition-[height] duration-700 ease-[var(--ease-out)] [.js_&]:block [.js_&]:p-0 ${
          placing ? "cursor-copy" : ""
        }`}
        style={result ? { height: result.height } : undefined}
        data-mode={mode}
      >
        <span aria-hidden="true" className="paper-grid pointer-events-none absolute inset-0 opacity-60" />
        <AnimatePresence>
          {placing && (
            <motion.span
              aria-hidden="true"
              className="label pointer-events-none absolute right-3 top-3 z-[999] bg-ink px-3 py-2 text-paper"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.12 } }}
            >
              {fine ? "Click" : "Tap"} the desk to place {String(selectedIndex + 1).padStart(2, "0")}
            </motion.span>
          )}
        </AnimatePresence>
        {artifacts.map((artifact, i) => (
          <DeskCard
            key={artifact.id}
            artifact={artifact}
            index={i}
            size={result?.sizes[i] ?? BASE_SIZE[artifact.kind]}
            target={result?.targets[i] ?? null}
            draggable={mode === "scatter"}
            entered={inView && measured}
            reduce={reduce}
            bounds={result ? { width: width ?? 0, height: result.height } : null}
            bringToFront={bringToFront}
            selected={selected === artifact.id}
            onSelect={() => setSelected((s) => (s === artifact.id ? null : artifact.id))}
            register={register}
            describedBy={helpId}
            relatedTitle={
              artifact.exploration
                ? explorations.find((e) => e.slug === artifact.exploration)?.title
                : artifact.project
                  ? getProject(artifact.project)?.title
                  : undefined
            }
          />
        ))}
      </div>

      <div className="mt-4 flex min-h-[3.25rem] flex-wrap items-baseline justify-between gap-4 border-t border-ink pt-3" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {selectedArtifact ? (
            <motion.p
              key={selectedArtifact.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22 }}
              className="flex flex-wrap items-baseline gap-x-4"
            >
              <span className="label text-ink-muted">
                {String(selectedIndex + 1).padStart(2, "0")} — {selectedArtifact.label}
              </span>
              <span>{selectedArtifact.caption}</span>
              {selectedExploration && (
                <button
                  type="button"
                  onClick={() => openExploration(selectedExploration.slug)}
                  className="label link-line inline-flex min-h-11 items-center gap-2 text-ink"
                >
                  Explore {String(explorations.indexOf(selectedExploration) + 1).padStart(2, "0")} — {selectedExploration.title}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
              {!selectedExploration && selectedProject && (
                <Link href={`/work/${selectedProject.slug}`} className="label link-line inline-flex min-h-11 items-center gap-2 text-ink">
                  From {selectedProject.title}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                </Link>
              )}
            </motion.p>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              className="label text-ink-muted"
            >
              No card selected
            </motion.p>
          )}
        </AnimatePresence>
        {selectedArtifact && (
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="label link-line inline-flex min-h-11 items-center text-ink-muted hover:text-ink"
          >
            Deselect
          </button>
        )}
      </div>
    </div>
  );
}
