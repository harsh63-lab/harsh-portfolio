import type { ProjectBlock, Tone } from "@/content/projects";
import { mediaAspect, type Media } from "@/content/types";
import { MediaFill } from "../media/MediaFill";
import { LineReveal } from "../ui/LineReveal";
import { CropMarks, Plate } from "../ui/Plate";
import { Reveal } from "./Reveal";

// Editing aid: visible while developing, never shown to visitors.
export function Todo({ className = "" }: { className?: string }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <span className={`todo-tag ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-current" />
      To be supplied
    </span>
  );
}

function Figure({
  media,
  tone,
  numeral,
  caption,
  aspect,
  sizes,
  crop = true,
}: {
  crop?: boolean;
  media?: Media;
  tone: Tone;
  numeral: string;
  caption: string;
  aspect: string;
  sizes: string;
}) {
  return (
    <div className="relative w-full text-ink-muted" style={{ aspectRatio: media ? mediaAspect(media) : aspect }}>
      {crop && <CropMarks />}
      <Reveal effect="wipe" className="absolute inset-0 overflow-hidden">
        {media ? (
          <MediaFill media={media} sizes={sizes} />
        ) : (
          <Plate tone={tone} numeral={numeral} caption={caption} />
        )}
      </Reveal>
    </div>
  );
}

function Caption({ children, className = "" }: { children: string; className?: string }) {
  return <figcaption className={`label mt-3 text-ink-muted ${className}`}>{children}</figcaption>;
}

export function Block({ block, numeral }: { block: ProjectBlock; numeral: string }) {
  switch (block.kind) {
    case "lede":
      return (
        <div className="shell grid grid-cols-4 gap-x-6 py-16 md:grid-cols-12 md:py-24">
          <div className="col-span-4 md:col-span-9 md:col-start-3">
            {block.todo && <Todo className="mb-6" />}
            <Reveal as="p" effect="fade-up" className="drop-cap font-serif text-[clamp(1.6rem,2.9vw,2.6rem)] leading-[1.18]">
              {block.text}
            </Reveal>
          </div>
        </div>
      );

    case "context":
      return (
        <div className="shell pb-16 md:pb-24">
          <div className="grid grid-cols-1 gap-x-6 border-t border-ink md:grid-cols-3">
            {block.items.map((item, i) => (
              <Reveal key={item.label} effect="fade-up" className="border-b border-rule py-6 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
                <p className="label flex items-center gap-3 text-ink-muted">
                  <span className="text-signal-text">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </p>
                <p className="mt-3 text-[1.125rem] leading-snug">{item.value}</p>
              </Reveal>
            ))}
          </div>
          {block.todo && <Todo className="mt-4" />}
        </div>
      );

    case "chapter":
      return (
        <div className="shell pt-20 md:pt-32">
          <div className="relative grid grid-cols-4 items-end gap-x-6 border-t border-ink pt-6 md:grid-cols-12">
            <span aria-hidden="true" className="fv-hair col-span-1 text-[clamp(4.5rem,13vw,12rem)] leading-[0.8] tracking-[-0.05em] text-ink-muted md:col-span-3">
              {block.number}
            </span>
            <LineReveal as="h2" className="t-display fv-display col-span-3 md:col-span-9">
              {block.title}
            </LineReveal>
          </div>
        </div>
      );

    case "text":
      return (
        <div className="shell grid grid-cols-4 gap-x-6 py-14 md:grid-cols-12 md:py-20">
          <div className="col-span-4 mb-6 md:col-span-3 md:mb-0">
            <div className="md:sticky md:top-[calc(var(--nav-h)+24px)]">
              {block.heading && <h3 className="label border-t border-ink pt-3">{block.heading}</h3>}
              {block.todo && <Todo className="mt-3" />}
            </div>
          </div>
          <div className="col-span-4 md:col-span-7 md:col-start-5">
            <Reveal as="p" effect="fade-up" className="text-lead">
              {block.body[0]}
            </Reveal>
            {block.body.slice(1).map((p) => (
              <Reveal as="p" key={p} effect="fade-up" className="measure mt-6 text-ink-muted">
                {p}
              </Reveal>
            ))}
          </div>
        </div>
      );

    case "image": {
      const width = block.width ?? "wide";
      const aspect = block.aspect ?? "16 / 9";
      const tone = block.tone ?? "ink";
      if (width === "bleed") {
        return (
          <figure className="py-10 md:py-16">
            <Figure media={block.media} tone={tone} numeral={numeral} caption={block.caption} aspect={aspect} sizes="100vw" crop={false} />
            <Caption className="shell">{block.caption}</Caption>
          </figure>
        );
      }
      if (width === "offset") {
        return (
          <figure className="shell grid grid-cols-4 gap-x-6 py-10 md:grid-cols-12 md:py-16">
            <div className="col-span-4 md:col-span-8">
              <Figure media={block.media} tone={tone} numeral={numeral} caption={block.caption} aspect={aspect} sizes="66vw" />
            </div>
            <Caption className="col-span-4 md:col-span-3 md:col-start-10 md:mt-0 md:self-end md:border-t md:border-ink md:pt-3">
              {block.caption}
            </Caption>
          </figure>
        );
      }
      return (
        <figure className={`shell py-10 md:py-16 ${width === "inset" ? "grid grid-cols-4 gap-x-6 md:grid-cols-12" : ""}`}>
          <div className={width === "inset" ? "col-span-4 md:col-span-8 md:col-start-3" : ""}>
            <Figure media={block.media} tone={tone} numeral={numeral} caption={block.caption} aspect={aspect} sizes="(min-width: 768px) 70vw, 100vw" />
            <Caption>{block.caption}</Caption>
          </div>
        </figure>
      );
    }

    case "split":
      return (
        <div className="shell grid grid-cols-4 gap-x-6 gap-y-10 py-14 md:grid-cols-12 md:py-20">
          <div className={`col-span-4 md:col-span-5 ${block.flip ? "md:order-2 md:col-start-8" : ""}`}>
            <div className="md:sticky md:top-[calc(var(--nav-h)+24px)]">
              <h3 className="label border-t border-ink pt-3">{block.heading}</h3>
              {block.todo && <Todo className="mt-3" />}
              <Reveal as="p" effect="fade-up" className="mt-8 text-lead">
                {block.body[0]}
              </Reveal>
              {block.body.slice(1).map((p) => (
                <Reveal as="p" key={p} effect="fade-up" className="mt-6 text-ink-muted">
                  {p}
                </Reveal>
              ))}
            </div>
          </div>
          <figure className={`col-span-4 md:col-span-6 ${block.flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
            <Figure media={block.media} tone={block.tone ?? "paper"} numeral={numeral} caption={block.caption} aspect="4 / 5" sizes="(min-width: 768px) 50vw, 100vw" />
            <Caption>{block.caption}</Caption>
          </figure>
        </div>
      );

    case "pair":
      return (
        <figure className="shell py-10 md:py-16">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {[0, 1].map((n) => (
              <div key={n} className={n === 0 ? "md:col-span-5" : "md:col-span-6 md:col-start-7 md:mt-32"}>
                <Figure
                  media={block.media?.[n]}
                  tone={n === 0 ? "paper" : "signal"}
                  numeral={numeral}
                  caption="Image to be supplied"
                  aspect={n === 0 ? "4 / 5" : "1 / 1"}
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </div>
            ))}
          </div>
          <Caption>{block.caption}</Caption>
        </figure>
      );

    case "gallery":
      return (
        <figure className="shell py-10 md:py-16">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
            <div className="col-span-2 md:col-span-7 md:row-span-2">
              <Figure media={block.media?.[0]} tone="ink" numeral={numeral} caption="Image to be supplied" aspect="4 / 5" sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
            <div className="col-span-1 md:col-span-5">
              <Figure media={block.media?.[1]} tone="paper" numeral={numeral} caption="Image to be supplied" aspect="4 / 3" sizes="(min-width: 768px) 40vw, 50vw" />
            </div>
            <div className="col-span-1 md:col-span-5 md:self-end">
              <Figure media={block.media?.[2]} tone="signal" numeral={numeral} caption="Image to be supplied" aspect="4 / 3" sizes="(min-width: 768px) 40vw, 50vw" />
            </div>
          </div>
          <Caption>{block.caption}</Caption>
        </figure>
      );

    case "credits":
      return (
        <div className="shell grid grid-cols-4 gap-x-6 py-14 md:grid-cols-12 md:py-20">
          <div className="col-span-4 mb-6 md:col-span-3 md:mb-0">
            <h3 className="label border-t border-ink pt-3">Credits</h3>
            {block.todo && <Todo className="mt-3" />}
          </div>
          <dl className="col-span-4 md:col-span-7 md:col-start-5">
            {block.items.map((item, i) => (
              <div key={i} className="grid grid-cols-[minmax(7rem,1fr)_2fr] gap-x-6 border-b border-rule py-3">
                <dt className="label pt-1 text-ink-muted">{item.role}</dt>
                <dd>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="link-line">
                      {item.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    item.name
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "quote":
      return (
        <blockquote className="shell grid grid-cols-4 gap-x-6 py-20 md:grid-cols-12 md:py-32">
          <div className="col-span-4 md:col-span-10 md:col-start-2">
            {block.todo && <Todo className="mb-6" />}
            <Reveal as="p" effect="fade-up" className="font-serif text-[clamp(2rem,5vw,4.75rem)] italic leading-[1.04]">
              <span aria-hidden="true" className="mr-1 text-signal-text">“</span>
              {block.text}
              <span aria-hidden="true" className="ml-1 text-signal-text">”</span>
            </Reveal>
            {block.source && <footer className="label mt-6 text-ink-muted">— {block.source}</footer>}
          </div>
        </blockquote>
      );
  }
}
