import { Gamepad2, Palette, Volleyball } from "lucide-react";
import { desk } from "@/content/desk";
import { explorations, projects } from "@/content/projects";
import { isPlaceholderEmail, site } from "@/content/site";
import { hasHref } from "@/content/types";
import { EmailStamp } from "../contact/EmailStamp";
import { VelocityMarquee } from "../contact/VelocityMarquee";
import { Desk } from "../desk/Desk";
import { ExplorationIndex } from "../explorations/ExplorationIndex";
import { ProjectIndex } from "../index/ProjectIndex";
import { MediaFill } from "../media/MediaFill";
import { Toolkit } from "../skills/Toolkit";
import { GitHubMark, LinkedInMark } from "../ui/BrandIcons";
import { Mark } from "../ui/Mark";
import { CropMarks } from "../ui/Plate";
import { Reveal } from "../work/Reveal";
import { SectionHead } from "./SectionHead";

type Numbered = { number: string };

export function ExplorationsSection({ number }: Numbered) {
  return (
    <section
      id="explorations"
      data-folio={number}
      data-folio-label="Explorations"
      tabIndex={-1}
      aria-labelledby="explorations-title"
      className="shell section-y outline-none"
    >
      <SectionHead
        number={number}
        title={site.sections.explorations.title}
        titleId="explorations-title"
        aside={<span className="tabular-nums">{String(explorations.length).padStart(2, "0")} entries</span>}
      >
        <p className="measure text-ink-muted">{site.sections.explorations.intro}</p>
      </SectionHead>
      <ExplorationIndex items={explorations} />
    </section>
  );
}

/** Real, finished projects. Renders nothing until projects exist. */
export function WorkSection({ number }: Numbered) {
  if (!projects.length) return null;
  return (
    <section
      id="index"
      data-folio={number}
      data-folio-label="Work"
      tabIndex={-1}
      aria-labelledby="index-title"
      className="shell section-y outline-none"
    >
      <SectionHead
        number={number}
        title={site.sections.work.title}
        titleId="index-title"
        aside={<span className="tabular-nums">{String(projects.length).padStart(2, "0")} entries</span>}
      >
        <p className="measure text-ink-muted">{site.sections.work.intro}</p>
      </SectionHead>
      <ProjectIndex projects={projects} />
    </section>
  );
}

export function ToolkitSection({ number }: Numbered) {
  if (!site.skills.length) return null;
  return (
    <section
      id="toolkit"
      data-folio={number}
      data-folio-label="Toolkit"
      tabIndex={-1}
      aria-labelledby="toolkit-title"
      className="shell section-y outline-none"
    >
      <SectionHead number={number} title={site.sections.skills.title} titleId="toolkit-title" aside={<span>Character set</span>}>
        <p className="measure text-ink-muted">{site.sections.skills.intro}</p>
      </SectionHead>
      <Toolkit groups={site.skills} />
    </section>
  );
}

export function DeskSection({ number }: Numbered) {
  if (!desk.enabled) return null;
  return (
    <section
      id="desk"
      data-folio={number}
      data-folio-label="Desk"
      tabIndex={-1}
      aria-labelledby="desk-title"
      className="shell section-y outline-none"
    >
      <SectionHead
        number={number}
        title={desk.title}
        titleId="desk-title"
        aside={<span className="tabular-nums">{String(desk.artifacts.length).padStart(2, "0")} objects</span>}
      >
        <p className="measure text-ink-muted">{desk.intro}</p>
      </SectionHead>
      <Desk artifacts={desk.artifacts} />
    </section>
  );
}

const INTEREST_ICONS: Record<string, typeof Palette> = { Art: Palette, Volleyball, Gaming: Gamepad2 };

export function ColophonSection({ number }: Numbered) {
  return (
    <section
      id="colophon"
      data-folio={number}
      data-folio-label="About"
      tabIndex={-1}
      aria-labelledby="colophon-title"
      className="tone-flip section-y outline-none"
    >
      <div className="shell">
        <SectionHead number={number} title={site.sections.colophon.title} titleId="colophon-title" aside={<span>About</span>} />

        <div className="grid grid-cols-4 gap-x-6 gap-y-14 md:grid-cols-12">
          <div className="col-span-4 flex flex-col gap-10 md:col-span-12 lg:col-span-4">
            {site.portrait && (
              <div className="relative aspect-[4/5] w-full max-w-sm text-ink-muted">
                <CropMarks />
                <Reveal effect="wipe" className="absolute inset-0 overflow-hidden">
                  <MediaFill media={site.portrait} sizes="(min-width: 768px) 33vw, 100vw" />
                </Reveal>
              </div>
            )}
            <div className="relative max-w-md text-ink-muted lg:max-w-sm">
              <CropMarks />
              <div className="paper-grid bg-paper-2 p-6 text-ink">
                <p className="label flex justify-between text-ink-muted">
                  <span>Specimen card</span>
                  <span>№ 01</span>
                </p>
                <p className="fv-display mt-8 text-[clamp(2rem,4vw,2.75rem)] leading-[0.95] tracking-[-0.03em]">{site.name}</p>
                <p className="mt-2 font-serif text-[1.375rem] italic">{site.tagline}</p>
                <dl className="mt-8 border-t border-ink">
                  {site.facts.map((f) => (
                    <div key={f.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 border-b border-rule py-2.5">
                      <dt className="label pt-1 text-ink-muted">{f.label}</dt>
                      <dd className="text-[0.9375rem]">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-12 lg:col-span-7 lg:col-start-6">
            {site.bio.map((p, i) => (
              <Reveal
                as="p"
                key={p}
                effect="fade-up"
                className={i === 0 ? "font-serif text-lead text-ink" : "measure mt-6 text-ink-muted"}
              >
                {p}
              </Reveal>
            ))}

            <div className="mt-16">
              <h3 className="label border-b border-ink pb-2 text-ink-muted">Character — set in five weights</h3>
              <ul className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2">
                {site.traits.map((t, i) => (
                  <li key={t} className="flex items-baseline gap-5">
                    <span
                      className="trait text-[clamp(1.875rem,3.6vw,3.25rem)] leading-none tracking-[-0.03em]"
                      style={{ ["--w" as string]: 220 + i * 140, ["--d" as string]: 75 + (i % 3) * 12 }}
                    >
                      {t}
                    </span>
                    {i < site.traits.length - 1 && <span aria-hidden="true" className="h-2 w-2 bg-signal" />}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
              <div>
                <h3 className="label border-b border-ink pb-2 text-ink-muted">Interests</h3>
                <ul className="mt-2">
                  {site.interests.map((item) => {
                    const Icon = INTEREST_ICONS[item];
                    return (
                      <li key={item} className="flex items-center gap-3 border-b border-rule py-3">
                        {Icon && <Icon aria-hidden="true" className="h-5 w-5 text-signal-text" strokeWidth={1.5} />}
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
              {site.experience.length > 0 && (
                <div>
                  <h3 className="label border-b border-ink pb-2 text-ink-muted">Experience</h3>
                  <ul className="mt-2">
                    {site.experience.map((entry, i) => (
                      <li key={i} className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-b border-rule py-3">
                        <span className="label pt-1 text-ink-muted">{entry.years}</span>
                        <span>
                          {entry.role}
                          <span className="text-ink-muted"> · {entry.place}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <p className="label mt-16 text-ink-muted">Set in Bricolage Grotesque &amp; Instrument Serif.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function handle(href: string) {
  try {
    return new URL(href).pathname.replace(/^\/(in\/)?|\/$/g, "");
  } catch {
    return "";
  }
}

export function ContactSection({ number }: Numbered) {
  const links = site.links.filter(hasHref);
  return (
    <section
      id="contact"
      data-folio={number}
      data-folio-label="Contact"
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="pt-[clamp(6rem,13vw,11rem)] outline-none"
    >
      <div className="shell">
        <SectionHead number={number} title={site.contactHeadline} titleId="contact-title" aside={<span>Contact</span>} />
        <EmailStamp email={site.email} placeholder={isPlaceholderEmail(site.email)} />
        {links.length > 0 && (
          <ul className="mt-16 grid grid-cols-1 border-t border-ink sm:grid-cols-2">
            {site.links.map((link) => {
              if (!hasHref(link)) return null;
              const Mark = link.kind === "github" ? GitHubMark : link.kind === "linkedin" ? LinkedInMark : null;
              return (
                <li key={link.label} className="border-b border-rule sm:odd:border-r sm:odd:pr-6 sm:even:pl-6">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} profile: ${handle(link.href)} (opens in a new tab)`}
                    className="group flex min-h-16 items-center gap-4 py-4"
                  >
                    {Mark && <Mark className="h-6 w-6 shrink-0 transition-colors group-hover:text-signal-text" />}
                    <span className="flex flex-col">
                      <span className="label">{link.label}</span>
                      <span className="text-ink-muted transition-colors group-hover:text-ink">{handle(link.href)}</span>
                    </span>
                    <span aria-hidden="true" className="ml-auto transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="mt-20 md:mt-28">
        <VelocityMarquee text={site.marquee} />
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="shell label flex flex-wrap items-center justify-between gap-4 py-8 text-ink-muted">
      <span className="inline-flex items-center gap-3">
        <Mark className="h-6 w-6 text-ink" />© {site.name}
      </span>
      <span>{site.location}</span>
    </footer>
  );
}
