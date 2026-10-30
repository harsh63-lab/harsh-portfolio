import type { Project } from "@/content/projects";
import { mediaStill } from "@/content/types";
import { MediaFill } from "../media/MediaFill";
import { Plate } from "../ui/Plate";

export function Cover({
  project,
  index,
  size = "lg",
  priority = false,
  sizes = "100vw",
  decorative = false,
  still = false,
}: {
  project: Project;
  index: number;
  size?: "sm" | "lg";
  priority?: boolean;
  sizes?: string;
  decorative?: boolean;
  /** Previews (index, next project) always show a still, never video or embeds. */
  still?: boolean;
}) {
  const media = still ? (project.thumbnail ?? (project.cover ? mediaStill(project.cover) : null)) : project.cover;

  if (media) {
    return (
      <div className="relative h-full w-full">
        <MediaFill media={media} sizes={sizes} priority={priority} decorative={decorative} />
      </div>
    );
  }
  return (
    <Plate
      tone={project.tone}
      numeral={String(index + 1).padStart(2, "0")}
      caption="Cover image — to be supplied"
      size={size}
      decorative={decorative}
    />
  );
}
