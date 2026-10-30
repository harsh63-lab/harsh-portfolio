import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { JumpLink } from "@/components/ui/JumpLink";
import { LineReveal } from "@/components/ui/LineReveal";
import { CropMarks } from "@/components/ui/Plate";
import { SectionTracker } from "@/components/ui/SectionTracker";
import { Block, Todo } from "@/components/work/Blocks";
import { Cover } from "@/components/work/Cover";
import { CoverParallax } from "@/components/work/CoverParallax";
import { NextProject } from "@/components/work/NextProject";
import { FocusOnMount, ReadingProgress } from "@/components/work/ReadingProgress";
import { getNextProject, getProject, projects, type ProjectBlock } from "@/content/projects";
import { hasHref } from "@/content/types";

// Cache Components requires at least one param; with no projects yet the
// route only ever 404s (proxy.ts rejects unknown slugs before rendering).
export function generateStaticParams() {
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "__none__" }];
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: "article", title: project.title, description: project.summary, url: `/work/${project.slug}` },
    twitter: { card: "summary_large_image", title: project.title, description: project.summary },
  };
}

export default function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<CaseSkeleton />}>
      <CaseStudy params={props.params} />
    </Suspense>
  );
}

// Shown only if a case study is opened before it has been prefetched. It keeps
// the page's frame (rule, crop marks) without filled boxes that read as broken.
function CaseSkeleton() {
  return (
    <div className="shell min-h-[100svh] pt-[calc(var(--nav-h)+20px)]" aria-busy="true">
      <div className="label flex min-h-11 items-center border-b border-ink pb-3 text-ink-muted">
        <span role="status">Setting the page…</span>
      </div>
      <div aria-hidden="true" className="relative mt-[clamp(12rem,24vw,20rem)] aspect-[4/5] w-full text-ink-muted sm:aspect-[16/10] md:aspect-[16/8]">
        <CropMarks />
      </div>
    </div>
  );
}

type Chapter = { id: string; number: string; title: string; blocks: ProjectBlock[] };

function toChapters(blocks: ProjectBlock[]) {
  const intro: ProjectBlock[] = [];
  const chapters: Chapter[] = [];
  for (const block of blocks) {
    if (block.kind === "chapter") {
      chapters.push({ id: `chapter-${block.number}`, number: block.number, title: block.title, blocks: [block] });
    } else if (chapters.length) {
      chapters[chapters.length - 1].blocks.push(block);
    } else {
      intro.push(block);
    }
  }
  return { intro, chapters };
}

async function CaseStudy({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const numeral = String(index + 1).padStart(2, "0");
  const next = getNextProject(slug);
  const { intro, chapters } = toChapters(project.blocks);

  return (
    <SectionTracker>
    <article>
      <ReadingProgress />
      <FocusOnMount targetId="case-title" />

      <header id="case" data-folio={numeral} data-folio-label="Case study" className="pt-[calc(var(--nav-h)+20px)]">
        <div className="shell">
          <div className="label flex items-center justify-between border-b border-ink pb-3 text-ink-muted">
            <Link href="/#index" transitionTypes={["back-to-index"]} className="group inline-flex min-h-11 items-center gap-2 text-ink">
              <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-1" strokeWidth={1.75} />
              Index
            </Link>
            <span className="tabular-nums">
              Case study {numeral} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>

          {project.placeholder && (
            <p className="mt-6 flex flex-wrap items-center gap-3 text-ink-muted">
              <Todo />
              <span className="text-[0.9375rem]">Placeholder case study — replace the copy and images in content/projects.ts.</span>
            </p>
          )}

          <div className="mt-10 grid grid-cols-4 gap-x-6 gap-y-8 md:mt-14 md:grid-cols-12">
            <LineReveal as="h1" id="case-title" tabIndex={-1} className="t-display fv-display col-span-4 outline-none md:col-span-8">
              {project.title}
            </LineReveal>
            <div className="col-span-4 self-end md:col-span-4">
              <p className="font-serif text-lead italic">{project.summary}</p>
              {chapters.length > 0 && (
                <nav aria-label="In this story" className="mt-8 border-t border-ink pt-3">
                  <p className="label text-ink-muted">In this story</p>
                  <ol className="mt-2">
                    {chapters.map((c) => (
                      <li key={c.id}>
                        <JumpLink to={c.id} className="label group flex min-h-11 items-center gap-4 border-b border-rule">
                          <span className="text-signal-text">{c.number}</span>
                          <span className="link-line">{c.title}</span>
                        </JumpLink>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
            </div>
          </div>
        </div>

        <div className="shell mt-12 md:mt-16">
          <div className="relative aspect-[4/5] w-full text-ink-muted sm:aspect-[16/10] md:aspect-[16/8]">
            <CropMarks />
            <ViewTransition
              name={`cover-${project.slug}`}
              share={{ "open-project": "morph", "back-to-index": "morph", "next-project": "morph", default: "none" }}
              default="none"
            >
              <div className="absolute inset-0 overflow-hidden">
                <CoverParallax>
                  <Cover project={project} index={index} priority sizes="100vw" />
                </CoverParallax>
              </div>
            </ViewTransition>
          </div>
        </div>

        <div className="shell">
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-ink pt-4 md:grid-cols-12">
            {project.meta
              .filter((m) => m.value.trim())
              .map((m) => (
                <div key={m.label} className="md:col-span-3">
                  <dt className="label text-ink-muted">{m.label}</dt>
                  <dd className="mt-1">{m.value}</dd>
                </div>
              ))}
            {(project.links ?? []).length > 0 && (
              <div className="col-span-2 md:col-span-12">
                <dt className="label text-ink-muted">Links</dt>
                <dd className="mt-1 flex flex-wrap gap-x-8 gap-y-1">
                  {(project.links ?? []).map((link) =>
                    hasHref(link) ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 underline decoration-signal underline-offset-4"
                      >
                        {link.label}
                        <span aria-hidden="true">↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span key={link.label} className="inline-flex min-h-11 items-center gap-3 text-ink-muted">
                        {link.label}
                        <span className="todo-tag">Link to be supplied</span>
                      </span>
                    ),
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      {intro.length > 0 && (
        <section id="introduction" data-folio="00" data-folio-label="Introduction" aria-label="Introduction">
          {intro.map((block, i) => (
            <Block key={i} block={block} numeral={numeral} />
          ))}
        </section>
      )}

      {chapters.map((c) => (
        <section
          key={c.id}
          id={c.id}
          tabIndex={-1}
          data-folio={c.number}
          data-folio-label={c.title}
          aria-label={`Chapter ${c.number}: ${c.title}`}
          className="outline-none"
        >
          {c.blocks.map((block, i) => (
            <Block key={i} block={block} numeral={numeral} />
          ))}
        </section>
      ))}

      <div className="h-24 md:h-40" />
      <NextProject project={next} index={projects.indexOf(next)} />
    </article>
    </SectionTracker>
  );
}
