import type React from "react";
import Image from "next/image";
import type { Artifact } from "@/content/desk";
import type { ImageMedia } from "@/content/types";
import { ChipArt, ControllerArt, SketchbookArt, TerminalArt, VolleyballArt } from "../illustrations/Illustrations";

function IllustrationCard({
  n,
  label,
  className,
  accent,
  children,
}: {
  n: string;
  label: string;
  className: string;
  /** Overrides the orange accent inside the drawing (e.g. on an orange card). */
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={`relative flex h-full w-full flex-col justify-between p-3 ${className}`}>
      <span className="label flex justify-between">
        <span>{label}</span>
        <span>{n}</span>
      </span>
      <span
        className="relative flex flex-1 items-center justify-center py-2"
        style={accent ? ({ "--signal": accent } as React.CSSProperties) : undefined}
      >
        {children}
      </span>
      <span className="label opacity-80">Illustration</span>
    </span>
  );
}

function Img({ media }: { media: ImageMedia }) {
  return <Image src={media.src} alt={media.alt} fill sizes="300px" className="object-cover" draggable={false} />;
}

function readableOn(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L > 0.18 ? "#121212" : "#f3f1ec";
}

function Missing({ children }: { children: string }) {
  return <span className="label text-ink-muted">{children}</span>;
}

// Each kind is a different physical frame for real material. Without media or
// text, the frame shows a clearly marked placeholder.
export function ArtifactFace({ artifact, index }: { artifact: Artifact; index: number }) {
  const n = String(index + 1).padStart(2, "0");
  const { media } = artifact;

  switch (artifact.kind) {
    case "chip":
      return (
        <IllustrationCard n={n} label="Microchip" className="paper-grid bg-paper text-ink">
          <ChipArt className="h-full max-h-[150px] w-full" />
        </IllustrationCard>
      );
    case "terminal":
      return (
        <IllustrationCard n={n} label="Terminal" className="bg-ink text-paper">
          <TerminalArt className="h-full max-h-[120px] w-full" />
        </IllustrationCard>
      );
    case "sketchbook":
      return (
        <IllustrationCard n={n} label="Sketchbook" className="bg-paper text-ink">
          <SketchbookArt className="h-full max-h-[170px] w-full" />
        </IllustrationCard>
      );
    case "volleyball":
      return (
        <IllustrationCard n={n} label="Volleyball" className="bg-paper-2 text-ink">
          <VolleyballArt className="h-full max-h-[140px] w-full" />
        </IllustrationCard>
      );
    case "controller":
      return (
        <IllustrationCard n={n} label="Controller" className="bg-signal text-on-signal" accent="#f3f1ec">
          <ControllerArt className="h-full max-h-[110px] w-full" />
        </IllustrationCard>
      );
    case "sketch":
      return (
        <span className="paper-grid relative flex h-full w-full flex-col justify-between bg-paper p-3 text-ink">
          <span className="label text-ink-muted">Sketch · {n}</span>
          <span className="relative my-2 block flex-1">
            {media ? (
              <Img media={media} />
            ) : (
              <svg aria-hidden="true" viewBox="0 0 120 90" className="absolute inset-0 m-auto w-3/4 text-ink" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M8 70 C 30 20, 60 20, 70 50 S 100 80, 112 24" strokeLinecap="round" />
                <circle cx="70" cy="50" r="3" fill="var(--signal)" stroke="none" />
              </svg>
            )}
          </span>
          {!media && <Missing>Sketch to be supplied</Missing>}
        </span>
      );

    case "photo":
      return (
        <span className="relative flex h-full w-full flex-col bg-paper p-2.5 pb-0 text-ink">
          <span className="relative block flex-1 overflow-hidden bg-ink">
            {media ? (
              <Img media={media} />
            ) : (
              <span className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_20%,rgb(255_255_255/0.16),transparent_60%)]" />
            )}
          </span>
          <span className="label block py-2.5 text-ink-muted">{media ? `Photo · ${n}` : "Photo to be supplied"}</span>
        </span>
      );

    case "screen":
      return (
        <span className="relative flex h-full w-full flex-col border border-ink bg-paper text-ink">
          <span className="flex items-center justify-between border-b border-ink px-3 py-1.5">
            <span className="label">Screen · {n}</span>
            <span className="h-2 w-2 bg-signal" />
          </span>
          <span className="relative block flex-1">
            {media ? (
              <Img media={media} />
            ) : (
              <span className="grid h-full grid-cols-3 gap-1.5 p-3">
                <span className="col-span-2 bg-ink/85" />
                <span className="bg-ink/15" />
                <span className="bg-ink/15" />
                <span className="col-span-2 bg-ink/30" />
              </span>
            )}
          </span>
        </span>
      );

    case "detail":
      return (
        <span className="relative flex h-full w-full flex-col bg-ink p-2 text-paper">
          <span className="relative block flex-1 overflow-hidden">
            {media ? (
              <Img media={media} />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-1/2 w-1/2 rounded-full border border-paper/40" />
              </span>
            )}
            <span aria-hidden="true" className="absolute left-2 top-2 h-3 w-3 border-l border-t border-paper/70" />
            <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-paper/70" />
          </span>
          <span className="label px-1 pt-2 text-paper/80">{media ? `Detail · ${n}` : "Detail to be supplied"}</span>
        </span>
      );

    case "note":
      return (
        <span className="paper-ruled relative flex h-full w-full flex-col justify-between bg-paper px-4 pb-3 pt-3 text-ink">
          <span className="label text-ink-muted">Note · {n}</span>
          {artifact.text ? (
            <span className="font-serif text-[1.35rem] italic leading-[22px]">{artifact.text}</span>
          ) : (
            <Missing>Note text to be supplied</Missing>
          )}
        </span>
      );

    case "swatch": {
      const hex = artifact.swatch?.hex;
      return (
        <span
          className={`relative flex h-full w-full flex-col justify-between p-4 ${hex ? "" : "bg-signal text-on-signal"}`}
          style={hex ? { background: hex, color: readableOn(hex) } : undefined}
        >
          <span className="flex flex-col gap-1">
            <span className="label">Colour study</span>
            <span className="label">{hex ? (artifact.swatch?.name ?? hex.toUpperCase()) : "Colour to be supplied"}</span>
          </span>
          <span
            className={`${hex ? "text-[2rem]" : "text-[3.5rem]"} leading-none`}
            style={{ fontVariationSettings: '"wght" 780, "wdth" 75' }}
          >
            {hex ? `#${hex.replace("#", "").toUpperCase().slice(0, 6)}` : n}
          </span>
        </span>
      );
    }
  }
}
