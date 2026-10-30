// Personal details for the site. Only facts supplied by the person who
// commissioned this portfolio are used here — nothing is invented. Editorial
// copy (bio, intros) is written *about* Harsh and is not a quotation.
// Optional fields (portrait, CV, experience, timezone) are simply omitted
// from the page while empty.

import type { ImageMedia, LinkRef } from "./types";

export type SiteLink = LinkRef & { kind?: "github" | "linkedin" | "cv" | "other" };
export type ExperienceEntry = { years: string; place: string; role: string };
export type SkillGroup = { group: string; items: string[] };

export const site = {
  /**
   * Publication approval, separate from content. While false the site sends
   * noindex and robots.txt blocks crawlers. Leave false until Harsh has seen it.
   */
  indexable: false,

  /** Public URL, used for canonical links, sitemap and social previews. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  lang: "en-IN",

  name: "Harsh Pimpalapure",
  /** How the name is set in the hero, one entry per line. */
  heroLines: ["HARSH", "PIMPALAPURE"],
  role: "Electronics & VLSI student",
  location: "Pune, Maharashtra, India",
  /** IANA time zone, shows local time in the nav on large screens. */
  timezone: "Asia/Kolkata" as string | null,

  /** Hero tagline (serif) and supporting line. */
  tagline: "Between circuits & curiosity.",
  intro: "Exploring electronics, software and design. Currently studying Electronics and VLSI Design & Technology in Pune.",

  /** Facts shown in the hero footer and the About section's specimen card. */
  facts: [
    { label: "Studying", value: "Electronics and VLSI Design & Technology" },
    { label: "College", value: "AISSMS College of Engineering" },
    { label: "Year", value: "First year" },
    { label: "Based in", value: "Pune, Maharashtra, India" },
  ],

  bio: [
    "Harsh is a first-year engineering student exploring the intersection of electronics, software and design. Curious by nature, he enjoys discovering how things work and experimenting with new ideas. Outside technology, you'll find his interests drifting toward art, volleyball and gaming.",
  ],

  traits: ["Funny", "Creative", "Ambitious", "Introverted", "Curious"],
  interests: ["Art", "Volleyball", "Gaming"],

  /** Optional — add an image to show a portrait in the About section. */
  portrait: null as ImageMedia | null,

  skills: [
    { group: "Programming", items: ["Python", "JavaScript", "TypeScript"] },
    { group: "Frontend", items: ["React", "Next.js", "HTML", "CSS"] },
    { group: "Backend", items: ["Node.js"] },
    { group: "Database", items: ["MongoDB"] },
    { group: "Tools", items: ["Git", "GitHub", "Docker", "AWS", "Figma"] },
  ] as SkillGroup[],

  /** Optional — leave empty to hide. */
  experience: [] as ExperienceEntry[],

  contactHeadline: "Say hello",
  email: "harshpimpalapure63@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/harsh63-lab", kind: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/harsh-pimpalapure-702a30415", kind: "linkedin" },
  ] as SiteLink[],

  /** Text for the scrolling band above the footer. */
  marquee: "Between circuits & curiosity",

  sections: {
    explorations: {
      title: "Explorations",
      intro: "Not a gallery of finished projects — yet. Four things Harsh is studying, exploring and enjoying right now.",
    },
    work: { title: "Work", intro: "Selected projects. Open one to read the case study." },
    skills: {
      title: "Toolkit",
      intro: "The languages, frameworks and tools in his kit. A character set, not a scorecard.",
    },
    colophon: { title: "Colophon" },
  },

  title: "Harsh Pimpalapure — Electronics, Code & Design",
  description:
    "Harsh Pimpalapure is a first-year Electronics and VLSI Design & Technology student in Pune, exploring programming, electronics and creative design.",
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
}

export function heroLines() {
  return site.heroLines.length ? site.heroLines : site.name.split(/\s+/).filter(Boolean);
}

export function isPlaceholderEmail(email: string) {
  return /@example\.(com|org|net)$/i.test(email);
}
