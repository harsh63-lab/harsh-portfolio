import { ArrowDown } from "lucide-react";
import { heroLines, site } from "@/content/site";
import { CropMarks } from "../ui/Plate";
import { JumpLink } from "../ui/JumpLink";
import { GridRules } from "./GridRules";
import { SpecimenName, SpecimenProvider, SpecimenReadout } from "./SpecimenName";

export function Hero() {
  return (
    <section
      id="top"
      data-folio="01"
      data-folio-label="Specimen"
      tabIndex={-1}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-6 pt-[calc(var(--nav-h)+12px)] outline-none md:pb-10"
    >
      <GridRules />
      <SpecimenProvider>
        <div className="shell">
          <div className="label relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 pb-3 text-ink-muted">
            <span className="rise text-ink" style={{ ["--d" as string]: "250ms" }}>
              Specimen № 01
            </span>
            <span className="rise hidden md:inline" style={{ ["--d" as string]: "380ms" }}>
              Bricolage Grotesque — Wght 200–800
            </span>
            <span aria-hidden="true" className="rise tabular-nums" style={{ ["--d" as string]: "500ms" }}>
              <SpecimenReadout />
            </span>
            <span aria-hidden="true" className="rule-x absolute inset-x-0 bottom-0 h-px bg-ink" style={{ ["--d" as string]: "120ms" }} />
          </div>
        </div>

        <h1 id="hero-title" className="shell relative flex flex-1 items-center py-8 md:py-6">
          <span className="sr-only">{site.name}</span>
          <CropMarks
            className="hidden text-ink-muted md:block"
            style={{ inset: "18px calc(var(--gutter) - 8px)" }}
          />
          <span className="relative flex w-full items-center self-stretch">
            <SpecimenName lines={heroLines()} />
          </span>
        </h1>
      </SpecimenProvider>

      <div className="shell">
        <div className="relative grid grid-cols-4 gap-x-6 gap-y-6 pt-4 md:grid-cols-12">
          <span aria-hidden="true" className="rule-x absolute inset-x-0 top-0 h-px bg-ink" style={{ ["--d" as string]: "900ms" }} />
          <dl className="rise col-span-4 hidden gap-x-6 gap-y-3 md:col-span-12 md:grid md:grid-cols-4 lg:col-span-4 lg:grid-cols-2" style={{ ["--d" as string]: "1500ms" }}>
            {site.facts.map((f) => (
              <div key={f.label}>
                <dt className="label text-ink-muted">{f.label}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-snug">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="rise col-span-4 md:col-span-8 lg:col-span-5" style={{ ["--d" as string]: "1650ms" }}>
            <p className="font-serif text-lead italic">{site.tagline}</p>
            <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">{site.intro}</p>
          </div>
          <div
            className="rise col-span-4 flex flex-wrap items-end justify-between gap-4 md:col-span-4 md:flex-col md:items-end md:justify-end lg:col-span-3"
            style={{ ["--d" as string]: "1800ms" }}
          >
            <span aria-hidden="true" className="label text-ink-muted">
              <span className="[@media(pointer:coarse)]:hidden">Press the name</span>
              <span className="hidden [@media(pointer:coarse)]:inline">Tap the name</span>
            </span>
            <JumpLink
              to="explorations"
              className="label press group inline-flex min-h-11 items-center gap-3 whitespace-nowrap bg-ink px-4 py-3 text-paper hover:bg-signal hover:text-on-signal"
            >
              Start exploring
              <ArrowDown
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5"
                strokeWidth={1.75}
              />
            </JumpLink>
          </div>
        </div>
      </div>
    </section>
  );
}
