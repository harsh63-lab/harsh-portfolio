# Design Brief — "Living Specimen"

> Portfolio website for a friend. Primary direction: **Concept B — Living Specimen**, with a few selected playful interactions taken from **Concept C — Studio Floor**.
>
> **Status:** Planning only. Nothing is built yet.
> **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Motion for React (`motion/react`).
> **Profession:** To be confirmed. This brief is written to work for any discipline (see §10).

---

## 0. Content rules (read first)

- **Do not invent personal information.** Names, titles, clients, awards, metrics, quotes, dates and biography must come from the friend or the person commissioning the site.
- Until real content arrives, use obvious placeholders in `{{DOUBLE_BRACES}}` (for example `{{NAME}}`, `{{ROLE}}`, `{{PROJECT_01_TITLE}}`). They should look unfinished on purpose, so nobody ships them by mistake.
- No fake testimonials, made-up client logos, invented stats or "trusted by" strips.
- If a section has no real content, **remove the section**. Don't fill it with filler.

---

## 1. Concept

### The idea in one line
The friend's name, set in a variable typeface, is the hero image. The whole site is laid out like a **type-specimen sheet**: a printed sheet type foundries use to show a typeface at every size, weight and width.

### Why this direction
1. **It doesn't depend on great images.** The typography does the heavy lifting, so the site looks impressive with three projects and ordinary screenshots, and even better with strong work.
2. **It has one signature moment, not twenty effects.** The name reacts to the cursor, and that same hero image then becomes the transition into each project. Award-level sites usually rest on one strong idea carried through consistently.
3. **It works for any profession.** A specimen sheet is neutral and precise, so it can frame a designer's case studies, a developer's repos, a writer's essays or a photographer's series (§10).
4. **It's fast, accessible and works on phones.** The pages are mostly text, with no WebGL and no scroll-jacking. Everything stays readable when animation is turned off.

### What we take from Concept C (Studio Floor)
Only the parts that add play without breaking the editorial discipline:

| Taken from C | How it's adapted |
|---|---|
| Draggable artifacts with inertia | Kept to **one bounded section** ("The Desk", §6.4), not the whole site |
| Cards tilt when grabbed | Used on Desk artifacts, and in a lighter form on the index preview image |
| "Tidy up" button | Snaps scattered Desk artifacts into a neat specimen grid using a layout animation. It also gives keyboard users and reduced-motion users their alternative |
| Feeling of exploration | Expressed through optional hidden details (§7.5), not by making people explore to find the main content |

**Not taken from C:** the infinite canvas, the cobalt and lime palette, Unbounded and Space Mono, and the camera-zoom navigation. They would compete with the specimen identity.

---

## 2. How this avoids looking like a generic AI-made portfolio

| What generic portfolios do | What we do |
|---|---|
| Centred hero: "Hi, I'm X 👋 — a passionate ___" | The name *is* the hero, set huge, edge to edge, reacting to the cursor like a specimen showing every weight |
| Purple-to-blue gradients, glass cards, glow blobs | Flat paper and ink with **one** International Orange accent. No gradients, no glass, no glow |
| Inter / Poppins / Space Grotesk everywhere | Bricolage Grotesque (animated across weight, width and optical size) plus Instrument Serif italic. Type pairing is the personality |
| Rounded cards in a 3-column grid with drop shadows | A typographic **index list** (numbered rows, hairline rules) with a cursor-following preview |
| Fade-up on every element as it scrolls in | Each animation shows a change of state or a relationship (rule from the Motion kit). One or two key animations per view |
| Skill bars, "95% React" | No made-up measurements. Skills, if wanted, are set as a specimen "character set" |
| Custom cursor blob that follows everything | The cursor changes only where it means something (the preview image, a "Drag" label on the Desk, "Copy" on the email) |
| Emoji icons | No emoji used as icons. One SVG icon family (Phosphor, per the UI UX Pro Max rules), and as few icons as possible |
| Testimonials carousel and logo wall | Left out unless real, permitted quotes exist |
| Same template whatever the person | A metadata header that changes with the profession (§10), and a colophon that tells their real story |

The test: **if you swapped in a different name and the site still felt equally right, we failed.** The specimen sheet should show *this* person.

---

## 3. Design system

Derived from UI UX Pro Max (`--design-system`, variance 9 / motion 9 / density 2). We kept its rules: reduced motion, transform and opacity only, 4.5:1 contrast, one or two key animations per view, Server Components by default. We deliberately **rejected** its default output (Brutalism with instant transitions; monochrome with blue; Archivo and Space Grotesk) because instant transitions conflict with a highly animated brief, and that palette and font pairing is the generic default.

Once the profession is known, this section becomes `design-system/<slug>/MASTER.md`.

### 3.1 Colour tokens

All text pairs measured against WCAG 2.x.

**Light ("Paper", default)**

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `--paper` | `#F3F1EC` | Page background | — |
| `--paper-2` | `#E9E5DD` | Alternate band / Desk surface | ink 14.9:1 |
| `--ink` | `#121212` | Primary text, interactive borders | 16.6:1 on paper |
| `--ink-muted` | `#5E5B55` | Metadata, captions | 6.0:1 on paper, 5.4:1 on paper-2 |
| `--rule` | `#D8D4CC` | Decorative hairlines and grid only | Decorative; never the only edge of a control |
| `--signal` | `#FF4F00` | International Orange: fills, shapes, the cursor preview frame, selection | **2.9:1 on paper, never use for text on paper** |
| `--on-signal` | `#121212` | Text on orange fills | 5.7:1 |
| `--signal-text` | `#B33600` | When orange *text* is needed on paper (rare: links in prose) | 5.4:1 |

**Dark ("Ink")**, with paper and ink swapped and tones adjusted rather than inverted:

| Token | Hex | Contrast |
|---|---|---|
| `--paper` | `#121212` | — |
| `--paper-2` | `#1C1C1C` | — |
| `--ink` | `#F3F1EC` | 16.6:1 |
| `--ink-muted` | `#A39F97` | 7.1:1 |
| `--rule` | `#2A2A2A` | Decorative only |
| `--signal` | `#FF4F00` | 5.7:1, so usable as text in dark mode |
| `--on-signal` | `#121212` | 5.7:1 |

Rules:
- **One accent.** Orange appears in at most two or three places per screen. It marks *now*, *here* and *this*: current section, hovered row, text selection, focus ring.
- Components use semantic tokens (`--ink`, `--signal`), never raw hex.
- Theme follows `prefers-color-scheme`, with a manual switch styled as a specimen swatch ("Paper / Ink").
- `::selection` uses an orange background with ink text.

### 3.2 Typography

| Role | Typeface | Settings |
|---|---|---|
| Display / hero / index titles | **Bricolage Grotesque** (variable) | Axes: `wght` 200–800, `wdth` 75–100, `opsz` 12–96 |
| Contrast voice: asides, pull quotes, "and", numerals in the colophon | **Instrument Serif** | 400 and 400 italic only. Use italic as the "human" voice next to the grotesque |
| Body | Bricolage Grotesque | `opsz` set automatically, `wght` 400, `wdth` 100 |
| Labels, metadata, folios | Bricolage Grotesque | `wght` 500, uppercase, `letter-spacing: 0.08em`, tabular numerals |

Loaded via `next/font/google` with `display: swap`. Preload only the display cut. We have no monospace face: tabular numerals (`font-variant-numeric: tabular-nums`) give the specimen feel without adding a third family.

**Type scale** (fluid, `clamp()`):

| Step | Size | Use |
|---|---|---|
| `--t-hero` | `clamp(4.5rem, 18vw, 22rem)` | The name |
| `--t-display` | `clamp(3rem, 9vw, 9rem)` | Section titles |
| `--t-index` | `clamp(2rem, 5.5vw, 5.5rem)` | Project rows |
| `--t-lead` | `clamp(1.375rem, 2.2vw, 2rem)` | Intro paragraphs (Instrument Serif) |
| `--t-body` | `1.0625rem` (17px), never below 16px | Body |
| `--t-label` | `0.8125rem` (13px) | Uppercase labels only, never prose |

- Body line-height 1.55. Display line-height 0.88–0.95 with `letter-spacing: -0.03em` to `-0.05em`.
- Line length 60–72 characters on desktop, 35–60 on mobile.
- `text-wrap: balance` on short headings and `text-wrap: pretty` on prose.

### 3.3 Spacing, grid and shape

- **Spacing:** 8-point base, generous (density 2/10): `4, 8, 16, 24, 40, 64, 104, 168`. Section padding is 104–168 on desktop and 64 on mobile.
- **Grid:** 12 columns, 24px gutters on desktop; 4 columns, 16px gutters on mobile. Page margins `clamp(16px, 4vw, 56px)`.
- **The grid is visible.** Hairline column rules (`--rule`) show faintly on the hero and index, like a specimen sheet's printing marks. They draw themselves in on first load.
- **Shape:** `border-radius: 0` everywhere, apart from one deliberate exception: the theme swatch is a circle.
- **No drop shadows** except on lifted Desk artifacts, which use a single soft shadow so the "lifted" state reads physically.
- **Breakpoints:** 375 / 768 / 1024 / 1440.
- **Z-index scale:** `0 base, 10 sticky rules/folios, 20 preview image, 40 nav, 100 overlay, 1000 skip link`.

### 3.4 Specimen motifs (the visual vocabulary)
Reusable details that make it read as a specimen sheet rather than a website template:
- **Folio** in a corner: `03 / 06 — Index`, with tabular numerals that update per section.
- **Crop marks** at the corners of the hero and of case-study cover images.
- **Glyph tags:** `Aa`, `Rg 400`, `Wd 87`. Small live readouts of the hero's current axis values while the cursor plays with it.
- **Character-set strip:** `A B C … 0 1 2 … & ? !` used as a divider, or to set skills (only if real).
- **Hairline rules** between index rows that animate their length from 0 to 100% on first view.

---

## 4. Layout principles

1. **Type first, images second.** Images appear when asked for (hover, click), not all at once.
2. **Asymmetry with a grid underneath.** Big type sits off-centre on a strict 12-column grid. It should look bold and stay readable.
3. **One primary action per screen.** In the hero that's "See the work ↓". On the index it's opening a project. At the end it's contacting them.
4. **Content reads in DOM order.** Every effect is layered on content that already makes sense with JavaScript and animation turned off.
5. **Mobile is designed for, not squeezed in.** Hover previews become inline thumbnails; cursor reactivity becomes scroll- or tap-driven (§7).
6. **Plenty of white space.** It's what makes the type feel expensive.
7. **No horizontal page scroll, ever.** Marquees are clipped inside their own band.

---

## 5. Information architecture

```
/                 Home: Specimen → Index → Desk → Colophon → Contact
/work/[slug]      Case study (shared-element transition from the index)
/colophon         Optional long-form about page, if there's enough real material
```

- Every project has its own URL, for deep links and sharing.
- Navigation is fixed and small: name (home), Work, About, Contact, and the theme swatch. The current section is highlighted with the orange folio.
- A skip link goes to the main content. After a route change, focus moves to the page's `<h1>`.

---

## 6. Proposed sections

### 6.1 Specimen (hero)
- `{{NAME}}` set at `--t-hero`, filling the width and breaking across lines if needed.
- **Signature interaction:** each letter's weight, width and optical size respond to how close the cursor is. Letters near the pointer get heavier and wider, then spring back. Small glyph-tag readouts show the live values (`Wt 640 · Wd 92`).
- Below the name: `{{ROLE}}` and `{{LOCATION}}` as specimen metadata (`Specimen № 01 — {{ROLE}}, {{LOCATION}}`), plus one line in Instrument Serif italic in the friend's own words (`{{ONE_LINE_INTRO}}`).
- Load sequence (about 1.2s total, can be skipped, never blocks input): grid rules draw in, the name sets letter by letter from thin to regular, and the metadata fades in.

### 6.2 Index (work)
- A numbered typographic list: `01  {{PROJECT_TITLE}} ......... {{TYPE}} · {{YEAR}}`.
- **Hover/focus a row:** the title shifts width (`wdth` 75→100), the row's hairline fills orange, and a **preview image trails the cursor** with spring lag and a slight tilt in the direction of travel (the grab-tilt borrowed from C).
- **Click:** the preview image grows into the case-study cover (`layoutId` shared element) and the route changes underneath.
- Optional filter chips by `{{DISCIPLINE_TAGS}}`, which reorder rows with `layout` animation, only if there are enough projects (6 or more) to justify filtering.
- Mobile: each row shows a fixed thumbnail. No cursor follower.

### 6.3 Case study (`/work/[slug]`)
- The cover arrives through the shared-element transition and the crop marks snap into the corners.
- Header metadata grid: Role / Year / Team / Tools / Link. Fields adapt by profession (§10) and are **hidden if empty**.
- Body: a modular editorial layout of full-bleed images, a two-column text and image pair, pull quotes in Instrument Serif and captions in labels.
- A reading-progress hairline in orange along the top edge.
- "Next project" at the bottom: a giant title you scroll into, which carries you to the next case study.

### 6.4 The Desk (the playful section from Concept C)
- A bounded band (`--paper-2`) where 5–9 **real** artifacts lie scattered at slight angles: sketches, process photos, screenshots, notes, objects. Content depends on the profession and **must be real**.
- **Drag** with momentum, constrained to the band; cards lift (scale 1.04, soft shadow, tilt toward the pull) and settle with a little wobble.
- A **"Tidy up"** button snaps everything into a neat specimen grid with a `layout` animation. "Scatter" reverses it.
- Clicking or pressing Enter on an artifact opens a caption.
- **Accessibility:** artifacts are focusable buttons, and arrow keys nudge the focused card. With reduced motion or on touch-first small screens, the Desk loads already tidied.
- If there aren't enough real artifacts, **drop this section**. Don't fake it.

### 6.5 Colophon (about)
- Written as a type foundry's colophon: "Set in Bricolage Grotesque and Instrument Serif. Made by `{{NAME}}` in `{{LOCATION}}`."
- Real bio from the friend (`{{BIO}}`), lead paragraph in Instrument Serif.
- Optional portrait (`{{PORTRAIT}}`), shown as a crop-marked specimen plate.
- Optional character-set strip of real skills or tools (`{{SKILLS}}`).
- Optional experience list (`{{EXPERIENCE}}`) set as an index (year · place · role), only if provided.

### 6.6 Contact
- A huge "Say hello" or `{{CONTACT_HEADLINE}}` in the friend's own voice, with the email at `--t-display`.
- Clicking the email copies it and plays a **rubber-stamp "Copied"** animation (stamp scales down onto the paper with a slight random rotation). A real `mailto:` link sits beside it.
- Social links (`{{LINKS}}`) as plain text links, no icon wall.
- A **scroll-speed marquee** of `{{AVAILABILITY_LINE}}` (for example their current status, if they give one). It speeds up and skews slightly with scroll speed and pauses on hover and focus.
- Footer: folio, current year, time in `{{TIMEZONE}}` if they want it.

---

## 7. Animation system

Following the Motion AI Kit best practices and the UI UX Pro Max motion rules.

### 7.1 Principles
- Every animation shows **a change of state, a relationship between elements, or feedback to an action.** No decorative-only motion.
- **One or two key animations per view.** The hero name is the star; everything else supports it.
- Animate **transforms, opacity, clip-path and filter** only. Size and position changes go through Motion `layout` / `layoutId`.
- **Springs for physical motion** (x, y, rotate, scale, drag), since they keep their speed when interrupted. Use **`visualDuration` + `bounce`** to make them predictable.
- Exits run at about 60–70% of the entry duration.
- Every animation can be interrupted and never blocks input.
- Use the mood guidance: playful but precise. Small overshoot is fine (bounce 0.15–0.3), never wobbly UI chrome.

### 7.2 Motion tokens

| Token | Value | Use |
|---|---|---|
| `spring.snappy` | `{ type: "spring", visualDuration: 0.25, bounce: 0.15 }` | Hover, press, row states |
| `spring.settle` | `{ type: "spring", visualDuration: 0.45, bounce: 0.25 }` | Desk cards landing, stamp |
| `spring.layout` | `{ type: "spring", visualDuration: 0.55, bounce: 0.1 }` | Shared-element and layout transitions |
| `spring.follow` | `useSpring` stiffness ~300, damping ~30 | Cursor-follow preview, axis values |
| `ease.out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Line reveals, rule draws |
| `dur.micro` | 150–250ms | Small elements |
| `dur.surface` | up to 500ms | Large surfaces |
| `stagger.letters` | 30–40ms | Hero letter set |
| `stagger.lines` | 60–80ms | Masked line reveals |

### 7.3 Signature animations and how to build them (free `motion` package only)

| Effect | Approach | Notes |
|---|---|---|
| **Variable-font cursor reactivity** (hero) | One pointer `useMotionValue` pair → per-letter distance via `useTransform` → `useSpring` → `font-variation-settings` | Changing axes re-runs text layout, so keep it to the hero name only (about 20 glyphs or fewer), in a `contain: layout` box. No allocation in per-frame callbacks. Off for reduced motion and coarse pointers, which get a slow scroll-linked weight sweep instead |
| **Masked line reveals** | Split text into lines ourselves (no Motion+ `splitText`), wrap each in `overflow: clip`, animate `y: 100% → 0` with `whileInView` | Screen readers get the unsplit text via `aria-label` / visually hidden copy |
| **Index preview follower** | `useMotionValue` x/y → `useSpring`, rotation from `useVelocity(x)` mapped with `useTransform` | Only on fine pointers. `will-change: transform` only while visible |
| **Index → case study** | `layoutId` on the preview image and cover; `AnimatePresence` for page content | Unique `layoutId` per project slug |
| **Grid rules draw-in** | `scaleY` / `scaleX` 0 → 1 with `ease.out`, staggered | Once per session |
| **Desk drag** | `drag` + `dragConstraints` (band ref) + `dragTransition` momentum; `whileDrag` lift and tilt | Keyboard nudge alternative; momentum drag runs on the main thread, which is fine at this scale |
| **Tidy up / Scatter** | Toggle layout state and use `layout` on each card | Rapid toggles must cancel cleanly; the final state is set explicitly |
| **Scroll-speed marquee** | `useScroll` → `useVelocity` → `useSpring` → speed factor; `useAnimationFrame` advances x | Built by hand rather than Motion+ `Ticker`; pauses offscreen, on hover/focus, and under reduced motion |
| **Rubber stamp "Copied"** | `AnimatePresence`: scale 1.6 → 1, opacity 0 → 1, random rotate ±6°, `spring.settle` | Status announced through an `aria-live="polite"` region |
| **Reading progress** | `useScroll().scrollYProgress` → `scaleX` | Hardware accelerated |
| **Theme switch** | Swatch circle scales out from the click point via `clip-path: circle()` | Plain crossfade under reduced motion |

Rules from the Motion kit applied throughout:
- Import from `motion/react` in client components; `motion/react-client` for `motion.*` elements in Server Components; **never** `framer-motion`.
- Never read `motionValue.get()` during render; use `.on("change", …)` and never `onChange`.
- Use the `useTransform(value, input, output)` form; never the deprecated function form.
- Motion+ components (`Cursor`, `Ticker`, `splitText`, `ScrambleText`) are **not** assumed. Ask before adding `motion-plus`.
- Simple hover colour changes, rule shimmer and infinite loops stay in CSS.

### 7.4 Reduced motion and fallbacks
- `<MotionConfig reducedMotion="user">` at the root, plus `@media (prefers-reduced-motion: reduce)` in CSS.
- Under reduced motion:
  - The hero is set in its final weight with no cursor reactivity.
  - Line reveals become fades or show immediately.
  - The Desk starts tidied with drag off; arrow keys still work.
  - The marquee is static.
  - The shared-element transition becomes a crossfade.
- Coarse pointers (touch): no cursor follower, Desk drag allowed but with a visible "Tidy up", and hero reactivity mapped to scroll.
- Everything renders readable and complete with JavaScript disabled.

### 7.5 Small delights (optional, only if they fit the friend's personality)
- Typing the friend's initials anywhere snaps the hero to its heaviest, widest setting for a moment.
- The folio shows live local time in `{{TIMEZONE}}`.
- A console message in the browser's developer tools, written in their voice.
- Highlighting text uses the orange selection plus a glyph-tag readout.

---

## 8. Accessibility and performance checklist

- [ ] Text contrast at least 4.5:1 in **both** themes (tokens above are measured)
- [ ] Visible 2px orange focus ring with 2px offset; never removed
- [ ] Sticky nav and folio never cover a keyboard-focused element
- [ ] Skip link; headings in order (`h1` → `h2` → …); focus moves to `<h1>` on route change
- [ ] Every drag interaction has a click and keyboard alternative (Tidy up, arrow nudge)
- [ ] Moving content (marquee) can be paused and stops on focus, hover, reduced motion and offscreen
- [ ] Pointer targets at least 24×24px (44px on touch); `cursor: pointer` on clickable things
- [ ] Images in AVIF/WebP via `next/image`, with dimensions declared; below-the-fold images lazy-loaded
- [ ] Layout shift (CLS) under 0.1: reserve space for the hero name and fonts (`next/font`, `display: swap`)
- [ ] Server Components by default; animation lives in small `"use client"` leaf components
- [ ] Desk and case-study galleries split into separate bundles with `next/dynamic`
- [ ] Per-frame work under about 16ms; no object allocation in pointer and frame callbacks
- [ ] Tested at 375px, landscape, with reduced motion on, and in both themes
- [ ] No emoji used as icons; one SVG icon family, kept to a minimum

---

## 9. Proposed project structure (for later, not created yet)

```
app/
  layout.tsx            fonts, MotionConfig provider, theme
  page.tsx              Server Component composing sections
  work/[slug]/page.tsx
components/
  specimen/             Hero name (client), GlyphTag, Folio, CropMarks
  index/                ProjectIndex, IndexRow, PreviewFollower (client)
  desk/                 Desk (client, dynamic), Artifact
  contact/              EmailStamp (client), VelocityMarquee (client)
  ui/                   LineReveal, Rule, ThemeSwatch
content/
  site.ts               {{NAME}}, {{ROLE}}, links… (single source of truth)
  projects/*.mdx        one file per project
design-system/<slug>/MASTER.md   generated from this brief once the profession is known
```

All personal content lives in `content/`, so nothing personal is hard-coded inside components.

---

## 10. Adapting to the profession (to be filled in)

The structure stays the same. What changes is the **specimen metadata**, the **index columns**, the **case-study fields** and the **Desk contents**.

| Profession | Index row shows | Case-study fields | Desk artifacts | Notes |
|---|---|---|---|---|
| Product / UI designer | Title · Client/Context · Year | Problem, Role, Process, Outcome | Sketches, wireframes, sticky notes | Case studies are the main feature |
| Graphic / brand designer | Title · Type (identity, print…) · Year | Brief, System, Applications | Print samples, logo explorations | Bigger images; preview follower larger |
| Developer / engineer | Title · Stack · Year | What it does, Architecture, Links (repo/live) | Terminal snippets, diagrams, hardware photos | Character-set strip can show languages; add a `Code` link column |
| Photographer / filmmaker | Series · Location · Year | Series statement, Gear (optional) | Contact prints, BTS shots | Index previews become the main image; consider borrowing Concept A's slow fade-in for images only |
| Writer / journalist | Headline · Publication · Year | Excerpt, Link to the piece | Notebook pages, clippings | Long-form reading styles; Instrument Serif for body |
| Illustrator / 3D artist | Title · Medium · Year | Process, Final pieces | Sketches, WIP renders | The Desk can become the main section |
| Architect / industrial designer | Project · Typology · Year | Site, Concept, Drawings | Models, drawings | Crop marks and plates suit technical drawings |
| Student / early career | Project · Course or context · Year | What I did, What I learned | Process work | Fewer projects is fine; the Desk shows range |

**Placeholders the friend needs to supply** (nothing will be invented):
`{{NAME}}`, `{{ROLE}}`, `{{LOCATION}}`, `{{TIMEZONE}}`, `{{ONE_LINE_INTRO}}`, `{{BIO}}`, `{{PORTRAIT}}` (optional), `{{PROJECTS}}` (3–6: title, year, role, summary, media, links), `{{DESK_ARTIFACTS}}` (optional, 5–9), `{{SKILLS}}` (optional), `{{EXPERIENCE}}` (optional), `{{CONTACT_HEADLINE}}`, `{{EMAIL}}`, `{{LINKS}}`, `{{AVAILABILITY_LINE}}` (optional), plus the site's main goal (recruiters, clients or audience).

---

## 11. Open questions (before build)

1. Profession and the site's main goal, which decide §10.
2. How the name should be set: full name or short? Its letter count changes the hero composition.
3. How many real projects there are, and what media exists for each.
4. Whether there are enough real artifacts for the Desk.
5. Default theme: Paper (light) or Ink (dark)?
6. Domain and hosting (Vercel assumed).
7. Is adding Motion+ (`motion-plus`) acceptable, or should we stay on the free `motion` package? Current assumption: **free only**.
