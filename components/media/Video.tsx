"use client";

import { Pause, Play } from "lucide-react";
import { useInView } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { VideoMedia } from "@/content/types";
import { usePrefersReducedMotion } from "../ui/useMedia";

export function Video({ media, decorative = false }: { media: VideoMedia; decorative?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const ambient = (media.mode ?? "ambient") === "ambient";
  const reduce = usePrefersReducedMotion();
  const inView = useInView(ref, { margin: "10% 0px 10% 0px" });
  const [choice, setChoice] = useState<"play" | "pause" | null>(null);
  const wantsPlay = choice ? choice === "play" : !reduce;

  // Ambient loops play only while visible and allowed to move.
  useEffect(() => {
    const video = ref.current;
    if (!video || !ambient) return;
    if (inView && wantsPlay) video.play().catch(() => {});
    else video.pause();
  }, [ambient, inView, wantsPlay]);

  // Next keeps visited routes mounted but hidden; display:none doesn't stop
  // playback, so pause explicitly when this route is hidden.
  useLayoutEffect(() => {
    const video = ref.current;
    return () => video?.pause();
  }, []);

  const sources = typeof media.src === "string" ? [{ src: media.src, type: undefined }] : media.src;

  return (
    <div className="absolute inset-0">
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted={ambient}
        loop={ambient}
        playsInline
        controls={!ambient}
        preload={ambient ? "metadata" : "none"}
        aria-label={decorative ? undefined : media.alt}
        aria-hidden={decorative || undefined}
        tabIndex={decorative ? -1 : undefined}
      >
        {sources.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
        {media.captions && (
          <track kind="captions" src={media.captions.src} srcLang={media.captions.srclang} label={media.captions.label} default />
        )}
      </video>
      {ambient && !decorative && (
        <button
          type="button"
          onClick={() => setChoice(wantsPlay ? "pause" : "play")}
          className="label absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 bg-ink/80 px-3 text-paper backdrop-blur-sm hover:bg-ink"
        >
          {wantsPlay ? (
            <Pause aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          ) : (
            <Play aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          )}
          {wantsPlay ? "Pause video" : "Play video"}
        </button>
      )}
    </div>
  );
}
