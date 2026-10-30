import { getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { mediaStill } from "@/content/types";
import { OG_SIZE, projectCard, publicImage } from "@/lib/og";

export const alt = `Case study preview — ${site.name}`;
export const size = OG_SIZE;
export const contentType = "image/png";

// Cache Components requires at least one param; with no projects yet the
// route only ever 404s (proxy.ts rejects unknown slugs before rendering).
export function generateStaticParams() {
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: "__none__" }];
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug) ?? projects[0];
  if (!project) return new Response("Not found", { status: 404 });
  const still = project.thumbnail ?? (project.cover ? mediaStill(project.cover) : null);
  const image = still && typeof still.src === "string" ? await publicImage(still.src) : null;
  return projectCard({
    number: String(projects.indexOf(project) + 1).padStart(2, "0"),
    title: project.title,
    meta: `${project.category} · ${project.year}`,
    name: site.name,
    image,
    tone: project.tone,
  });
}
