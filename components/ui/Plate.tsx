import type React from "react";
import type { Tone } from "@/content/projects";

const toneClass: Record<Tone, string> = {
  signal: "bg-signal text-on-signal",
  ink: "bg-ink text-paper",
  paper: "bg-paper-2 text-ink",
};

type Props = {
  tone: Tone;
  numeral: string;
  caption?: string;
  className?: string;
  size?: "sm" | "lg";
  decorative?: boolean;
};

export function Plate({ tone, numeral, caption = "Image to be supplied", className = "", size = "lg", decorative = false }: Props) {
  const big = size === "lg";
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `Placeholder plate ${numeral}: ${caption}`}
      aria-hidden={decorative || undefined}
      className={`relative isolate flex h-full w-full overflow-hidden ${toneClass[tone]} ${className}`}
      style={{ containerType: "size" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: big ? "8.333% 12.5%" : "16.66% 25%",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-[0.18em] -right-[0.04em] font-sans leading-none"
        style={{
          fontSize: "min(78cqh, 58cqw)",
          fontVariationSettings: '"wght" 780, "wdth" 75, "opsz" 96',
          letterSpacing: "-0.04em",
        }}
      >
        {numeral}
      </span>
      <span
        aria-hidden="true"
        className="absolute left-[6%] top-[9%] font-serif italic leading-none"
        style={{ fontSize: "22cqh" }}
      >
        Aa
      </span>
      <span aria-hidden="true" className="label absolute bottom-[7%] left-[6%] max-w-[42%] opacity-80">
        {caption}
      </span>
      <span aria-hidden="true" className="label absolute right-[5%] top-[8%] opacity-80">
        Pl. {numeral}
      </span>
    </div>
  );
}

export function CropMarks({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} style={style}>
      <span className="crop crop-tl" />
      <span className="crop crop-tr" />
      <span className="crop crop-bl" />
      <span className="crop crop-br" />
    </span>
  );
}
