"use client";

import { LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import type { SkillGroup } from "@/content/site";

// Two-letter "glyphs" in the manner of a specimen sheet's character set.
const GLYPHS: Record<string, string> = {
  Python: "Py",
  JavaScript: "Js",
  TypeScript: "Ts",
  React: "Re",
  "Next.js": "Nx",
  HTML: "Ht",
  CSS: "Cs",
  "Node.js": "No",
  MongoDB: "Mg",
  Git: "Gi",
  GitHub: "Gh",
  Docker: "Dk",
  AWS: "Aw",
  Figma: "Fg",
};

function glyphFor(name: string) {
  if (GLYPHS[name]) return GLYPHS[name];
  const clean = name.replace(/[^A-Za-z]/g, "");
  return clean.charAt(0).toUpperCase() + clean.charAt(1).toLowerCase();
}

// A character set, not a scorecard: every technology is one tile, grouped by
// the categories it was supplied in. No levels, percentages or rankings.
export function Toolkit({ groups }: { groups: SkillGroup[] }) {
  const [filter, setFilter] = useState<string | null>(null);
  const tiles = groups.flatMap((g) => g.items.map((name) => ({ name, group: g.group })));
  const selected = groups.find((g) => g.group === filter);

  return (
    <div>
      <LayoutGroup id="toolkit">
        <div role="group" aria-label="Filter by group" className="flex flex-wrap gap-2">
          {[null, ...groups.map((g) => g.group)].map((g) => {
            const on = filter === g;
            return (
              <button
                key={g ?? "all"}
                type="button"
                aria-pressed={on}
                aria-label={`${g ?? "All"}, ${g ? groups.find((x) => x.group === g)!.items.length : tiles.length} entries`}
                onClick={() => setFilter(g)}
                className={`label press relative inline-flex min-h-11 items-center px-4 transition-colors ${
                  on ? "text-paper" : "text-ink hover:text-signal-text"
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="toolkit-chip"
                    className="absolute inset-0 bg-ink"
                    transition={{ type: "spring", visualDuration: 0.35, bounce: 0.15 }}
                  />
                )}
                <span className="relative">
                  {g ?? "All"}
                  <span className="ml-2 tabular-nums opacity-70">
                    {g ? groups.find((x) => x.group === g)!.items.length : tiles.length}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <p className="label mt-4 min-h-[1.3em] text-ink-muted" aria-live="polite">
        {selected ? `${selected.group} — ${selected.items.join(", ")}` : `${tiles.length} entries in ${groups.length} groups`}
      </p>

      <ul className="mt-8 grid grid-cols-2 border-l border-t border-ink sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {tiles.map((t, i) => {
          const dim = filter !== null && filter !== t.group;
          return (
            <li
              key={t.name}
              className={`toolkit-tile group relative flex aspect-[4/5] flex-col justify-between border-b border-r border-ink p-3 transition-colors duration-300 sm:p-4 ${
                dim ? "text-ink-muted" : "text-ink"
              }`}
              data-on={filter === t.group || undefined}
            >
              <span aria-hidden="true" className="toolkit-bar absolute inset-x-0 top-0 h-[3px] origin-left bg-signal" />
              <span className="label flex justify-between text-ink-muted">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="hidden sm:inline">{t.group}</span>
              </span>
              <span aria-hidden="true" className="toolkit-glyph block text-[clamp(3.25rem,7vw,5.5rem)] leading-none tracking-[-0.04em]">
                {glyphFor(t.name)}
              </span>
              <span className="text-[0.9375rem] leading-tight">
                {t.name}
                <span className="sr-only"> — {t.group}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
