// "The Desk": a scatter of objects you can pick up and move.
//
// Cards come in two families:
//  - Illustrations (chip, terminal, sketchbook, volleyball, controller, note):
//    custom conceptual drawings that stand for an interest. They are not
//    artwork by Harsh. Link them to an exploration with `exploration: "<slug>"`.
//  - Real material (sketch, photo, screen, detail, swatch): actual process
//    images from real projects, added later with `media` and `project`.

import type { ImageMedia } from "./types";

export type IllustrationKind = "chip" | "terminal" | "sketchbook" | "volleyball" | "controller" | "note";
export type MaterialKind = "sketch" | "photo" | "screen" | "detail" | "swatch";
export type ArtifactKind = IllustrationKind | MaterialKind;

export type Artifact = {
  id: string;
  kind: ArtifactKind;
  /** Short label shown on the card and read by screen readers. */
  label: string;
  /** Shown when the card is selected. */
  caption: string;
  /** Slug of a related exploration (content/projects.ts → explorations). */
  exploration?: string;
  /** Slug of a real project this came from (content/projects.ts → projects). */
  project?: string;
  /** The real image, for material cards. */
  media?: ImageMedia;
  /** Text on a note card. */
  text?: string;
  /** For swatch cards: a colour actually used in a project. */
  swatch?: { hex: string; name?: string };
  /** Starting position on the desk (0–1 across and down) and tilt in degrees. */
  scatter: { x: number; y: number; rotate: number };
};

export const desk = {
  enabled: true,
  title: "The Desk",
  intro: "Six objects for six interests. Pick them up, move them around — select one to see where it leads.",
  artifacts: [
    {
      id: "chip",
      kind: "chip",
      label: "Microchip",
      exploration: "electronics-vlsi",
      caption: "Illustration · A microchip and its schematic — for the field he's studying, Electronics and VLSI Design & Technology.",
      scatter: { x: 0.04, y: 0.12, rotate: -6 },
    },
    {
      id: "terminal",
      kind: "terminal",
      label: "Terminal",
      exploration: "code-web",
      caption: "Illustration · A terminal window — for Python, JavaScript, TypeScript and the web stack he's exploring.",
      scatter: { x: 0.3, y: 0.56, rotate: 3 },
    },
    {
      id: "sketchbook",
      kind: "sketchbook",
      label: "Sketchbook",
      exploration: "art-design",
      caption: "Illustration · A sketchbook — for his interest in art and design.",
      scatter: { x: 0.44, y: 0.06, rotate: -3 },
    },
    {
      id: "volleyball",
      kind: "volleyball",
      label: "Volleyball",
      exploration: "beyond-the-screen",
      caption: "Illustration · A volleyball — for time on the court.",
      scatter: { x: 0.64, y: 0.6, rotate: 8 },
    },
    {
      id: "controller",
      kind: "controller",
      label: "Controller",
      exploration: "beyond-the-screen",
      caption: "Illustration · A game controller — for gaming.",
      scatter: { x: 0.74, y: 0.1, rotate: -8 },
    },
    {
      id: "curiosity",
      kind: "note",
      label: "Note on curiosity",
      text: "First, find out how it works.",
      caption: "An editorial note on curiosity, the thread through everything here — written for this site, not a quote.",
      scatter: { x: 0.92, y: 0.46, rotate: 4 },
    },
  ] as Artifact[],
};
