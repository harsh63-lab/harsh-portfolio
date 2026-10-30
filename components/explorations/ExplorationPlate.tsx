import type React from "react";
import type { ExplorationVisualKind, Tone } from "@/content/projects";
import { ChipArt, CourtArt, SketchbookArt, TerminalArt } from "../illustrations/Illustrations";

const toneClass: Record<Tone, string> = {
  signal: "bg-signal text-on-signal",
  ink: "bg-ink text-paper",
  paper: "bg-paper-2 text-ink",
};

const art: Record<ExplorationVisualKind, (p: { className?: string }) => React.ReactElement> = {
  circuit: ChipArt,
  code: TerminalArt,
  sketch: SketchbookArt,
  court: CourtArt,
};

// A specimen plate holding a conceptual illustration. The "Illustration"
// label keeps it distinct from photographs or screenshots of real work.
export function ExplorationPlate({
  kind,
  tone,
  number,
  title,
}: {
  kind: ExplorationVisualKind;
  tone: Tone;
  number: string;
  title: string;
}) {
  const Art = art[kind];
  return (
    <div
      role="img"
      aria-label={`Illustration for ${title}`}
      className={`relative isolate flex h-full w-full items-center justify-center overflow-hidden ${toneClass[tone]}`}
      style={{ containerType: "size" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "12.5% 10%",
        }}
      />
      <span
        className="relative block h-[58%] w-[72%]"
        style={tone === "signal" ? ({ "--signal": "#f3f1ec" } as React.CSSProperties) : undefined}
      >
        <Art className="h-full w-full" />
      </span>
      <span aria-hidden="true" className="label absolute left-[6%] top-[6%] opacity-85">
        Fig. {number}
      </span>
      <span aria-hidden="true" className="label absolute bottom-[6%] left-[6%] opacity-85">
        Illustration · {title}
      </span>
    </div>
  );
}
