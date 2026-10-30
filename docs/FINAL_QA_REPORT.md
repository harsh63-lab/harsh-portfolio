# Final QA Report — Harsh Pimpalapure · Living Specimen

**Date:** 31 October 2026  
**Scope:** Final quality audit with selective refinements: a new hero display treatment and a new brand mark. This was not a redesign.  
**Status:** Private. Not deployed, not published, not indexable.

---

## 1. How this audit was run (and what it does *not* cover)

All browser testing was done in **headless Google Chrome**, driven through the Chrome DevTools Protocol against the **production build** (`next build` + `next start`). Phones and tablets were **emulated** (viewport, touch events, `pointer: coarse`). Measurements were taken in the rendered page:

- element bounding boxes
- layout-shift (CLS) entries
- focus styles
- the console

Screenshots were reviewed by eye.

**Not tested:** Safari (macOS or iOS), Firefox, Edge, real phones or tablets, real screen readers, browser zoom at 200%, slow-network throttling. See §8.

Viewports: **375, 390, 768, 1024, 1280, 1440 px**, in light, dark and `prefers-reduced-motion: reduce`.

---

## 2. Summary of results (production build, after fixes)

| Check | Result |
|---|---|
| TypeScript (`tsc --noEmit`) | Pass |
| ESLint | Pass, 0 problems |
| Production build | Pass (12 static routes; `/opengraph-image` renders on demand) |
| Layout shift on load (CLS) | **0.0000** at every width, in light, dark and reduced motion |
| Horizontal overflow | None at any width |
| Tap targets under 24px | None |
| Console errors or warnings | None |
| Visible placeholder text | None |
| Hero name fit | Fills the space between the page margins exactly, one line per row, at all 6 widths (§4) |
| Fictional projects shown | None. `projects` is empty, so no Work section and no project routes |
| Privacy | `noindex, nofollow, nocache` on every page; `robots.txt` → `Disallow: /`; `site.indexable = false` |
| Deployment | None. No deploy configuration, no git remote |
| Client JS (home, gzipped) | ~297 KB in total (React DOM ~72 KB, Next runtime ~85 KB, app + Motion + GSAP + Lenis ~96 KB) |

---

## 3. Findings and fixes

Each fix was confirmed in the rendered page before and after the change.

| # | Finding (how found) | Fix | Why |
|---|---|---|---|
| 1 | **Hero weight readout never updated.** It stayed at "Wt 200" while letters visibly changed weight under the cursor (probed the readout text while moving the cursor). Introduced in an earlier hero refactor. | The readout now reads the cursor and ripple values before using them, so it always subscribes to them. | Motion's function-form `useTransform` subscribes only to values read on its first run. At that moment the list of letters was still empty, so it never subscribed to the pointer. Verified: rest 200 → 726 over the letters → 742 during the press ripple. |
| 2 | **Hero footer cramped at 768px.** The four facts sat in two narrow columns, "Electronics and VLSI Design & Technology" wrapped to four lines, and the button broke onto two lines (screenshot). | On tablets the facts form one 4-column row, with the tagline and button on the row below; the button text no longer wraps. Large-screen layout unchanged. | Readability and alignment at tablet width. Button height is now 44px at every width. |
| 3 | **About specimen card overflowed at 768px.** "Maharashtra," ran past the card's right edge (measured: text right edge past the card's). | On tablets the card spans the full row (max width 28rem) above the bio; value cells use `minmax(0, 1fr)`. Desktop unchanged. | No overflow, and no four-line wraps in the fact rows. |
| 4 | **Toolkit filter buttons had run-together accessible names** ("All14", "Frontend4"), found in the keyboard audit. | Explicit labels, e.g. "Frontend, 4 entries". | Screen-reader clarity. |
| 5 | **Email copy button's name repeated its hint** (address + "Click to copy"). | Name is now "Copy email address harshpimpalapure63@gmail.com"; the hint stays as its description. | No duplicate announcement. |
| 6 | **Decorative glyph strip directly after the Toolkit.** The Toolkit is itself presented as a "character set", so the strip repeated the motif with no purpose. | Removed from the page. The component is kept but unused. | Fewer decorative repeats; clearer rhythm between sections. |
| 7 | **Social preview card** still used the old hero cut and had no mark. | It now uses the new hero cut (weight 200, width 88) and the framed mark; the name is capped so it doesn't crowd the rules. | Link previews match the site. |

**Checked and found correct (no change needed):**
- Keyboard order matches the visual order across all 30 interactive elements, every stop shows a 2px focus ring, and nothing is hidden behind the nav. The skip link sits above the nav (z-index 1000).
- Nav jumps land each section 80px below the top, below the nav, with focus moved and the nav item marked current.
- Theme switch persists across a reload.
- Copy-email, mailto, GitHub and LinkedIn are correct and open in new tabs with `noopener noreferrer`.
- Explorations open and close by mouse, Enter and Space, with `aria-expanded` and the region in sync.
- Desk: mouse drag, keyboard nudge, Tidy up (`aria-pressed`), select → "Explore" opens and focuses the matching exploration. On touch, a swipe across a card scrolls the page and a long-press drags the card.
- With reduced motion: static weight ramp, no entrance, no Lenis, Desk starts tidied.
- **Adding a real project later:** I added a temporary test project, then removed it. Explorations stayed, a Work section appeared after it, section numbers renumbered automatically (01–07), `/work/<slug>` returned 200, and unknown slugs still returned 404.

**Reviewed and intentionally left alone:**
- The large gap between sections is the standard section spacing used everywhere.
- The "Colophon" heading under the "About" nav item is a deliberate editorial choice from the design brief. It's subjective; to change it, edit `site.sections.colophon.title`.

---

## 4. Refinement 1 — hero display typography

**Before:** Bricolage Grotesque capitals at weight 300 / width 100, swelling to 800 / 75 under the cursor.

**Problems found in a side-by-side study:**
- The wide, regular-weight capitals read as a generic grotesque.
- At the kinetic peak, the heavy condensed capitals crowded each other.

**Candidates compared** (rendered at rest and at the kinetic peak, then mocked in the real hero at 1440 and 390px):

| Candidate | Verdict |
|---|---|
| A — current treatment | Generic; crowded at its peak |
| **B — Bricolage, hairline, compensated widths** | **Chosen** |
| C — Bodoni Moda (Didone) | Beautiful masthead, but its wide capitals cut the name to 166px on desktop and **45px on a phone** (weaker than now), and it adds a third family competing with Instrument Serif |
| D — Bodoni italic + capitals | Mixed treatment; italic doesn't suit the kinetic system |
| E — Fraunces | Playful but trend-coded; less premium |
| F — Instrument Serif capitals | Fits the system but isn't variable, so the kinetic effect would be lost |
| G — Big Shoulders | Industrial, generic |
| H — Anybody | Width range too extreme; reads gimmicky |

**What was implemented:**
- **Rest:** weight 200, width 88, tracking −0.012em. Tall hairline capitals: an editorial masthead built from the site's own typeface, so the "Specimen" concept still holds (the hero demonstrates the font).
- **Peak** (under the cursor or press ripple): weight 800, width 75.
- **Compensated widths:** in Bricolage, weight adds about 33% width. Setting the rest wider and the peak narrower makes their footprints nearly equal, so letters trade lightness for weight **without crowding**. The largest glyph overlap measured at the peak is 0–2px.
- **Entrance:** letters rise set medium-condensed and settle into the hairline, then the weight wave sweeps through. Same timing system as before.
- **Unchanged:** fixed glyph slots (no layout shift), reveal only after the real font has loaded, and reduced-motion behaviour.

**Result:** larger, more striking, and still inside the page margins at every width.

| Width | Before | After | Rendered span (page margins) |
|---|---|---|---|
| 375 | 61px | **73px** | 16 → 349 |
| 390 | 64px | **76px** | 16 → 363 |
| 768 | 126px | **151px** | 31 → 732 |
| 1024 | 168px | **201px** | 41 → 983 |
| 1280 | 210px | **242px** | 51 → 1220 |
| 1440 | 237px | **272px** | 56 → 1384 |

---

## 5. Refinement 2 — logo / brand mark

**Before:** the initials "HP" set in the label font inside a 1px box. It read as a placeholder.

**Studied:**
- **A:** framed ligature.
- **B:** frameless heavy ligature.
- **C:** ligature with an orange lead trace.

Each was rendered at 96, 48, 32, 24 and 16px, in light and dark, and next to the wordmark.

**Chosen system (`components/ui/Mark.tsx`):**
- **Ligature:** H and P share one stem. The heavy stems against the hairline crossbar and bowl echo the hero's 200→800 weight range.
- **Orange node** at the junction of the H's crossbar and the shared stem: a "solder joint". A quiet nod to electronics without clip-art.
- **Crop-mark frame:** the same specimen crop marks used around the hero and plates. This ties the mark to the site rather than to a generic startup style.
- **Two sizes of one mark:** *framed* for the navbar (32px), the footer and the social cards; *compact* (frameless, heavier strokes) for the favicon and Apple touch icon, where the frame would clutter.
- **Colour:** drawn in the current text colour, so it adapts to light and dark themes, the inverted band, and every scale; the node uses the orange accent.
- **Interaction:** the frame opens slightly on hover or focus of the home link. No new animation library.

---

## 6. Performance notes

- Home page JavaScript is ~297 KB gzipped in total. The largest app chunk (~96 KB) contains Motion, GSAP (core + SplitText) and Lenis.
- **Optional future trim:** GSAP is used only to split the section headings into lines for their reveal (~30 KB gzipped). Replacing it with a small custom line-splitter would save that, but it isn't necessary and would change working behaviour, so I left it.
- The hero waits for its own font face before revealing, so there's no visible font swap or resize (CLS 0).
- The OG image routes render on demand because they read font files. That's acceptable for social crawlers, which fetch rarely.

---

## 7. Unresolved / known limitations

1. **No production domain is set.** Canonical URLs, the sitemap and OG image URLs use `http://localhost:3000` until `NEXT_PUBLIC_SITE_URL` is set. Intentional while the site is private.
2. **View-transition cover morphs** (only used once real projects exist) don't animate in Firefox, which falls back to an instant change. Untested in Safari.
3. **Haptic tick** on the Desk long-press only works where `navigator.vibrate` exists (e.g. Android Chrome). iOS Safari doesn't support it; the drag itself still works.
4. **The dev server is reachable on the local network** (Next prints a Network URL). For complete privacy while previewing, run `npm run dev -- --hostname 127.0.0.1`.
5. **The Next.js dev indicator** (bottom-left "N") appears in development only, never in production.

---

## 8. Remaining manual checks (not performed — real browsers and devices needed)

- [ ] **Safari, macOS:** variable-font rendering of the hero hairline (weight 200, width 88); kinetic smoothness; crop marks; theme switch (uses the View Transitions API with a fallback).
- [ ] **Safari, iOS (real iPhone):** hero tap-ripple; Desk long-press drag vs page scroll; copy-to-clipboard permission; safe areas; `100svh` hero height with the toolbar showing and hidden.
- [ ] **Chrome, Android (real device):** long-press drag and haptic; scroll performance of the kinetic hero.
- [ ] **Firefox (desktop):** variable fonts, Lenis smooth scrolling, Explorations panel.
- [ ] **Screen readers:**
  - VoiceOver (macOS and iOS) and NVDA on Windows: heading order, Explorations expand/collapse announcements, Toolkit filter announcements, Desk card names and caption announcements, copy-email status.
- [ ] **Browser zoom 200% / large text:** hero fit, nav wrapping, Desk card legibility.
- [ ] **Slow 3G throttling:** hero reveal timing (it waits for the font; the CSS fallback shows it after 2.5s regardless).
- [ ] **Link previews:** paste the URL into a private chat **after** a domain is configured. Not before, to keep the surprise.

---

## 9. Files changed in this pass

- `components/specimen/SpecimenName.tsx` — new rest/peak axes, tracking and entrance; readout subscription fix.
- `components/specimen/Hero.tsx` — specimen label; tablet footer layout; button no longer wraps.
- `components/ui/Mark.tsx` (new), `components/ui/Nav.tsx`, `components/sections/HomeSections.tsx` (footer mark, About tablet layout), `app/globals.css` (mark hover), `app/icon.svg`, `app/apple-icon.tsx`, `app/layout.tsx`.
- `lib/og.tsx`, `assets/fonts/bricolage-display-200-88.woff` (new) — social card.
- `components/skills/Toolkit.tsx`, `components/contact/EmailStamp.tsx` — accessible names.
- `app/page.tsx` — removed the duplicate glyph strip.

Content files (`content/site.ts`, `content/projects.ts`, `content/desk.ts`) are unchanged in this pass. Privacy remains `indexable: false`.
