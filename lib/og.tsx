import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const PAPER = "#f3f1ec";
const INK = "#121212";
const MUTED = "#5e5b55";
const SIGNAL = "#ff4f00";

async function fonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [light, heavy, text, serif] = await Promise.all([
    readFile(join(dir, "bricolage-display-200-88.woff")),
    readFile(join(dir, "bricolage-display-700-75.woff")),
    readFile(join(dir, "bricolage-text-500.woff")),
    readFile(join(dir, "instrument-serif-italic.woff")),
  ]);
  return [
    { name: "Display Light", data: light, weight: 200 as const, style: "normal" as const },
    { name: "Display Heavy", data: heavy, weight: 700 as const, style: "normal" as const },
    { name: "Text", data: text, weight: 500 as const, style: "normal" as const },
    { name: "Serif", data: serif, weight: 400 as const, style: "italic" as const },
  ];
}

/** Reads an image from /public as a data URI so it can be embedded. */
export async function publicImage(src: string) {
  if (!src.startsWith("/")) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", src));
    const ext = src.split(".").pop()?.toLowerCase();
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

function fit(lines: string[], max: number, width: number, ratio: number) {
  const longest = Math.max(...lines.map((l) => l.length), 1);
  return Math.min(max, Math.floor(width / (longest * ratio)));
}

// Framed mark (components/ui/Mark.tsx) for social cards.
function MarkSvg() {
  return (
    <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke={INK}>
      <path d="M1.5 6V1.5H6M26 1.5h4.5V6M30.5 26v4.5H26M6 30.5H1.5V26" strokeWidth="1" />
      <path d="M10 8v16M17.5 8v16" strokeWidth="2.6" />
      <path d="M10 16h7.5M17.5 8.6h3.6a3.9 3.9 0 0 1 0 7.8h-3.6" strokeWidth="1.25" />
      <circle cx="17.5" cy="16" r="1.9" fill={SIGNAL} stroke="none" />
    </svg>
  );
}

function Label({ children, color = MUTED }: { children: string; color?: string }) {
  return (
    <div style={{ fontFamily: "Text", fontSize: 22, letterSpacing: 2.5, textTransform: "uppercase", color }}>{children}</div>
  );
}

export async function siteCard({ lines, role, intro, url }: { lines: string[]; role: string; intro: string; url: string }) {
  const upper = lines.every((l) => l === l.toUpperCase());
  const size = fit(lines, 214, 1080, upper ? 0.44 : 0.56);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: PAPER, color: INK, padding: "48px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${INK}`, paddingBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <MarkSvg />
            <Label color={INK}>Specimen No. 01</Label>
          </div>
          <Label>{role}</Label>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: "Display Light",
                fontSize: size,
                lineHeight: 0.9,
                letterSpacing: -size * 0.012,
                alignSelf: i % 2 ? "flex-end" : "flex-start",
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderTop: `2px solid ${INK}`, paddingTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 22, height: 22, background: SIGNAL }} />
            <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 34, maxWidth: 760 }}>{intro}</div>
          </div>
          <Label>{url.replace(/^https?:\/\//, "")}</Label>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}

export async function projectCard({
  number,
  title,
  meta,
  name,
  image,
  tone,
}: {
  number: string;
  title: string;
  meta: string;
  name: string;
  image: string | null;
  tone: "signal" | "ink" | "paper";
}) {
  const plate = tone === "signal" ? SIGNAL : tone === "ink" ? INK : "#e9e5dd";
  const plateText = tone === "ink" ? PAPER : INK;
  const size = fit(title.split(" "), 130, 640, 0.5);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, color: INK }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, padding: "48px 56px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${INK}`, paddingBottom: 16 }}>
            <Label color={INK}>{`Case study ${number}`}</Label>
            <Label>{name}</Label>
          </div>
          <div style={{ fontFamily: "Display Heavy", fontSize: size, lineHeight: 0.92, letterSpacing: -size * 0.04, display: "flex" }}>
            {title}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, borderTop: `2px solid ${INK}`, paddingTop: 18 }}>
            <div style={{ width: 18, height: 18, background: SIGNAL }} />
            <Label>{meta}</Label>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, position: "relative", background: plate, color: plateText, overflow: "hidden" }}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: 36 }}>
              <div style={{ fontFamily: "Serif", fontStyle: "italic", fontSize: 120, lineHeight: 1 }}>Aa</div>
              <div style={{ fontFamily: "Display Heavy", fontSize: 300, lineHeight: 0.8, alignSelf: "flex-end", letterSpacing: -12 }}>
                {number}
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts() },
  );
}
