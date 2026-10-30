import type { StaticImageData } from "next/image";

// ---------------------------------------------------------------------------
// Media
//
// Images: put files in /public (src: "/work/project/cover.jpg" + width/height)
// or import them (`import cover from "./media/cover.jpg"`) so size and blur
// placeholder are read automatically.
// Videos: self-hosted MP4/WebM in /public. Always give a poster image.
// Embeds: YouTube / Vimeo player URLs (the embed URL, not the watch page).
// ---------------------------------------------------------------------------

type ImageSource =
  | { src: StaticImageData; width?: number; height?: number }
  | { src: string; width: number; height: number };

export type ImageMedia = ImageSource & {
  type: "image";
  /** Describe what the image shows. Use "" only for purely decorative images. */
  alt: string;
  caption?: string;
  credit?: string;
  /** Load eagerly — only for the first large image on a page. */
  priority?: boolean;
};

export type VideoMedia = {
  type: "video";
  /** One file, or several formats in order of preference (e.g. WebM then MP4). */
  src: string | { src: string; type: "video/mp4" | "video/webm" }[];
  poster: string;
  width: number;
  height: number;
  /** Text alternative describing the video's content. */
  alt: string;
  caption?: string;
  credit?: string;
  /** WebVTT captions — required if the video has speech. */
  captions?: { src: string; srclang: string; label: string };
  /**
   * "ambient": muted, looping, autoplays when visible (not with reduced motion).
   * "player": shows controls, never autoplays. Use for anything with sound.
   */
  mode?: "ambient" | "player";
};

export type EmbedMedia = {
  type: "embed";
  /** Player URL, e.g. https://player.vimeo.com/video/123 or https://www.youtube-nocookie.com/embed/abc */
  src: string;
  title: string;
  width: number;
  height: number;
  caption?: string;
};

export type Media = ImageMedia | VideoMedia | EmbedMedia;

// ---------------------------------------------------------------------------
// Links — `href: null` renders a clearly marked, non-interactive placeholder.
// ---------------------------------------------------------------------------

export type LinkRef = { label: string; href: string | null };

export function hasHref<T extends LinkRef>(link: T): link is T & { href: string } {
  return typeof link.href === "string" && link.href.length > 0;
}

export function mediaSize(media: Media) {
  if (media.type === "image" && typeof media.src !== "string") {
    return { width: media.width ?? media.src.width, height: media.height ?? media.src.height };
  }
  return { width: media.width as number, height: media.height as number };
}

export function mediaAspect(media: Media) {
  const { width, height } = mediaSize(media);
  return `${width} / ${height}`;
}

/** A still frame for places that only show images (index previews, OG images). */
export function mediaStill(media: Media): ImageMedia | null {
  if (media.type === "image") return media;
  if (media.type === "video") {
    return { type: "image", src: media.poster, width: media.width, height: media.height, alt: media.alt };
  }
  return null;
}
