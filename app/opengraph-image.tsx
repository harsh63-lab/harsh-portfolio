import { heroLines, site } from "@/content/site";
import { OG_SIZE, siteCard } from "@/lib/og";

export const alt = site.title;
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return siteCard({ lines: heroLines(), role: site.role, intro: site.tagline, url: site.url });
}
