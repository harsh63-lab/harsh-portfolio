# Harsh Pimpalapure — Living Specimen

Personal portfolio of Harsh Pimpalapure: exploring electronics, software and design. Built with Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4 and Motion.

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

Design rationale: [`docs/DESIGN_BRIEF.md`](docs/DESIGN_BRIEF.md). Latest quality audit: [`docs/FINAL_QA_REPORT.md`](docs/FINAL_QA_REPORT.md).

The site is private by default (`site.indexable = false`) and is not deployed anywhere.

## Editing content

The site is personalised for **Harsh Pimpalapure** using only facts supplied by the person who commissioned it. Everything personal lives in three files:

| File | What it holds |
|---|---|
| `content/site.ts` | Name and hero lines, role, facts, tagline and intro, bio, traits, interests, skills (grouped), contact email and links, marquee text, section copy, title and description, `indexable` |
| `content/projects.ts` | `explorations`: interest areas shown in the Explorations index. They expand in place and have no detail pages. `projects`: real, finished projects only (currently none). Once there are some, the Work section and `/work/<slug>` case studies appear automatically |
| `content/desk.ts` | Desk objects. *Illustration* cards (chip, terminal, sketchbook, volleyball, controller, note) link to an exploration. *Material* cards (sketch, photo, screen, detail, swatch) are for real process images later |

Optional content stays hidden while empty, so nothing unfinished is shown:

- **Portrait:** `site.portrait`.
- **Experience:** `site.experience`.
- **Links:** CV and others via `site.links`; links with `href: null` don't render.
- **Projects:** add entries to the projects list.
- **Local time:** `site.timezone`.

Privacy: `site.indexable` is `false`, which sends `noindex` and makes `robots.txt` block all crawlers. It is a publication decision, separate from whether the content is complete. Leave it `false` until publishing is approved.

Media types are defined in `content/types.ts`:

- **Image:** `{ type: "image", src, width, height, alt }`. `src` is a `/public` path or an imported file; imported files also get a blur placeholder.
- **Video:** `{ type: "video", src, poster, width, height, alt, mode: "ambient" | "player", captions? }`.
  - **Ambient** videos are muted and looping. They play only while visible, never autoplay with reduced motion, and have a pause button.
  - **Player** videos show controls and never autoplay. Use player mode for anything with sound, and add captions.
- **Embed:** `{ type: "embed", src, title, width, height }` for YouTube or Vimeo player URLs.

Put files in `public/work/<slug>/`, `public/desk/` and `public/about/`.

Going live (only when approved):

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain. Canonical links, the sitemap and social previews use it.
2. Set `site.indexable` to `true`.

Placeholder conventions:

- A link with `href: null` renders as a non-interactive label tagged "Link to be supplied".
- An `@example.com` email is tagged "Placeholder address", and the mail-app link stays hidden until a real address is added.
- Blocks with `todo: true` show a "To be supplied" tag during development only, never in production. `placeholder: true` on a project shows the banner at the top of its case study.
- Block types: `lede`, `context`, `chapter`, `text`, `image` (`bleed` / `wide` / `inset` / `offset`), `split`, `pair`, `gallery`, `quote` and `credits`.

Generated automatically: Open Graph images (site and per project; a project card uses the real cover once it is in `/public`), the Apple touch icon, `manifest.webmanifest`, `sitemap.xml` and `robots.txt`. Unknown `/work/*` URLs return a real 404 status via `proxy.ts`.

## Where things live

- `components/media/` — renders images (`next/image`), videos (pause when off-screen or when the route is hidden) and embeds.
- `components/specimen/` — the hero name. Each letter reacts to the cursor through the font's weight and width axes. On touch screens the effect follows scroll instead, and with reduced motion it becomes a static weight ramp.
- `components/explorations/` — the Explorations index (rows expand in place) and its illustration plates. `components/illustrations/` holds the conceptual SVG drawings, which are labelled "Illustration" wherever they appear.
- `components/skills/Toolkit.tsx` — the skills character set, with group filters and no proficiency levels.
- `components/index/` — the project index for future real work, plus `usePreviewPanel`, the shared large-screen preview panel. On large screens a preview panel sits in its own column, follows the active row vertically and stays inside the viewport. Tablets and phones show inline thumbnails. Opening a project morphs its cover into the case study using React `<ViewTransition>`.
- `components/desk/` — draggable artifacts with momentum and tilt. Mouse and pen drag straight away; on touch you hold a card to pick it up, so swiping still scrolls the page. Alternatives to dragging: select a card and then click or tap the desk, or use the arrow keys. "Tidy up" toggles a grid.
- `components/contact/` — the email that stamps "Copied" when clicked, and the scroll-speed marquee with a pause control.
- `components/ui/LineReveal.tsx` — masked line reveals on short headings using GSAP SplitText, the only place GSAP is used. Longer text uses a CSS fade (`components/work/Reveal.tsx`).
- `components/providers/SmoothScroll.tsx` — Lenis smooth scrolling, on for mouse and trackpad only and off when reduced motion is set. It runs from Motion's frame loop, so the page has a single animation loop.

## Adding your first project

1. Put the images or video in `public/work/<your-slug>/`, for example `public/work/line-follower/cover.jpg`.
2. In `content/projects.ts`, add an entry to `allProjects`. The comment at the top of that file shows the full shape. A minimal project:

   ```ts
   {
     slug: "line-follower",
     title: "Line-Follower Robot",
     category: "Electronics",
     year: "2026",
     summary: "One sentence on what it is and why it matters.",
     tone: "ink",
     cover: { type: "image", src: "/work/line-follower/cover.jpg", width: 2400, height: 1500, alt: "Describe the photo" },
     meta: [{ label: "Role", value: "Design and build" }],
     links: [{ label: "Code", href: "https://github.com/harsh63-lab/<repo>" }],
     blocks: [
       { kind: "lede", text: "Two or three sentences that set the scene." },
       { kind: "chapter", number: "01", title: "Build" },
       { kind: "text", heading: "How it works", body: ["…"] },
     ],
   }
   ```

   *(Example values only — use the real project's details.)*
3. Run `npm run dev` and check the home page. A **Work** section appears after Explorations, and the case study lives at `/work/<your-slug>`. Explorations stays where it is.
4. Optionally link a Desk object to it: in `content/desk.ts`, set `project: "<your-slug>"` on a card.

## Saving and pushing changes

```bash
npm run lint && npm run build     # make sure everything still works
git add -A
git commit -m "Add line-follower project"
git push
```

`node_modules/`, `.next/`, `.env*` files and other local artifacts are git-ignored. Never commit tokens or passwords.
