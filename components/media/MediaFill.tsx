import Image from "next/image";
import type { Media } from "@/content/types";
import { Video } from "./Video";

// Renders any media item filling its positioned parent.
export function MediaFill({
  media,
  sizes,
  priority = false,
  decorative = false,
}: {
  media: Media;
  sizes: string;
  priority?: boolean;
  decorative?: boolean;
}) {
  if (media.type === "image") {
    const blur = typeof media.src !== "string" && media.src.blurDataURL;
    return (
      <Image
        src={media.src}
        alt={decorative ? "" : media.alt}
        fill
        sizes={sizes}
        priority={priority || media.priority}
        placeholder={blur ? "blur" : "empty"}
        className="object-cover"
        draggable={false}
      />
    );
  }

  if (media.type === "video") return <Video media={media} decorative={decorative} />;

  return (
    <iframe
      src={media.src}
      title={media.title}
      loading="lazy"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      className="absolute inset-0 h-full w-full border-0"
      tabIndex={decorative ? -1 : undefined}
    />
  );
}
