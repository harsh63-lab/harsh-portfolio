// Real, finished projects only. Keep `slug` URL-safe and unique. Media lives
// in /public/work/<slug>/.
//
// `todo: true` marks a block whose copy is still a writing prompt — it renders
// with a visible "To be supplied" tag. Remove the flag once real copy is in.
//
// Shape of a finished project (illustrative structure only — not real content):
//
//   {
//     slug: "my-project",
//     title: "…",
//     category: "…",
//     year: "2025",
//     summary: "…",
//     tone: "ink",
//     cover: { type: "image", src: "/work/my-project/cover.jpg", width: 2400, height: 1500, alt: "…" },
//     // or: { type: "video", src: "/work/my-project/loop.mp4", poster: "/work/my-project/poster.jpg",
//     //       width: 1920, height: 1080, alt: "…", mode: "ambient" },
//     meta: [{ label: "Role", value: "…" }, { label: "Year", value: "2025" }],
//     links: [{ label: "Live site", href: "https://…" }],
//     blocks: [
//       { kind: "lede", text: "…" },
//       { kind: "chapter", number: "01", title: "…" },
//       { kind: "image", caption: "…", width: "bleed", media: { type: "image", src: "…", width: 2400, height: 1350, alt: "…" } },
//       { kind: "credits", items: [{ role: "…", name: "…", href: "https://…" }] },
//     ],
//   }

import type { ImageMedia, LinkRef, Media } from "./types";

export type Tone = "signal" | "ink" | "paper";

export type ProjectBlock =
  | { kind: "lede"; text: string; todo?: boolean }
  | { kind: "context"; items: { label: string; value: string }[]; todo?: boolean }
  | { kind: "chapter"; number: string; title: string }
  | { kind: "text"; heading?: string; body: string[]; todo?: boolean }
  | {
      kind: "image";
      caption: string;
      media?: Media;
      /** Placeholder plate colour while `media` is missing. */
      tone?: Tone;
      /** Placeholder aspect ratio while `media` is missing. */
      aspect?: string;
      width?: "bleed" | "wide" | "inset" | "offset";
    }
  | { kind: "split"; heading: string; body: string[]; caption: string; media?: Media; tone?: Tone; flip?: boolean; todo?: boolean }
  | { kind: "pair"; caption: string; media?: [Media, Media] }
  | { kind: "gallery"; caption: string; media?: [Media, Media, Media] }
  | { kind: "quote"; text: string; source?: string; todo?: boolean }
  | { kind: "credits"; items: { role: string; name: string; href?: string | null }[]; todo?: boolean };

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  /** Placeholder plate colour while no cover is supplied. */
  tone: Tone;
  /** Shows the "placeholder case study" banner. Remove once the copy is real. */
  placeholder?: boolean;
  /** Hidden projects are left out of the index, sitemap and routes (drafts). */
  hidden?: boolean;
  /** Hero media of the case study: image, ambient video or embed. */
  cover?: Media;
  /** Optional still for the index preview; defaults to the cover (or its poster). */
  thumbnail?: ImageMedia;
  /** Facts shown under the cover. Empty values are hidden. */
  meta: { label: string; value: string }[];
  /** Live site, repository, press, etc. `href: null` = not supplied yet. */
  links?: LinkRef[];
  blocks: ProjectBlock[];
};

// No finished projects yet. Add real projects here when they exist; the Work
// section and /work/<slug> case studies appear automatically.
const allProjects: Project[] = [];

/** Projects shown on the site, in index order. */
export const projects: Project[] = allProjects.filter((p) => !p.hidden);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

// ---------------------------------------------------------------------------
// Explorations — interest areas, not projects. Shown in the "Explorations"
// index on the home page; they expand in place and never link to a case study.
// Only supplied facts appear here.
// ---------------------------------------------------------------------------

export type ExplorationVisualKind = "circuit" | "code" | "sketch" | "court";

export type Exploration = {
  slug: string;
  title: string;
  /** Short category label shown in the index row. */
  kicker: string;
  summary: string;
  facts: { label: string; value: string }[];
  tags: string[];
  /** Conceptual illustration (not a picture of Harsh's work). */
  visual: ExplorationVisualKind;
  tone: Tone;
};

export const explorations: Exploration[] = [
  {
    slug: "electronics-vlsi",
    title: "Electronics & VLSI",
    kicker: "Field of study",
    summary:
      "His field of study: Electronics and VLSI Design & Technology — how electronic circuits work, all the way down to the chips that run them.",
    facts: [
      { label: "Course", value: "Electronics and VLSI Design & Technology" },
      { label: "College", value: "AISSMS College of Engineering, Pune" },
      { label: "Year", value: "First year" },
    ],
    tags: ["Electronics", "VLSI", "Chip design"],
    visual: "circuit",
    tone: "signal",
  },
  {
    slug: "code-web",
    title: "Code & Web",
    kicker: "Programming",
    summary: "Alongside electronics, he explores programming and the web — from languages to frameworks to the tools around them.",
    facts: [
      { label: "Languages", value: "Python, JavaScript, TypeScript" },
      { label: "Web", value: "React, Next.js, HTML, CSS, Node.js" },
      { label: "Data & tools", value: "MongoDB, Git, GitHub, Docker, AWS" },
    ],
    tags: ["Python", "TypeScript", "React", "Next.js", "Node.js"],
    visual: "code",
    tone: "ink",
  },
  {
    slug: "art-design",
    title: "Art & Design",
    kicker: "Creative side",
    summary: "Art is one of his interests — the creative counterweight to circuits and code. Figma is part of his toolkit.",
    facts: [
      { label: "Interest", value: "Art" },
      { label: "Design tool", value: "Figma" },
    ],
    tags: ["Art", "Design", "Figma"],
    visual: "sketch",
    tone: "paper",
  },
  {
    slug: "beyond-the-screen",
    title: "Beyond the Screen",
    kicker: "Off duty",
    summary: "Away from the screen: volleyball on the court. Back on it, for fun: gaming.",
    facts: [
      { label: "Sport", value: "Volleyball" },
      { label: "Play", value: "Gaming" },
    ],
    tags: ["Volleyball", "Gaming"],
    visual: "court",
    tone: "ink",
  },
];
