import type { MetadataRoute } from "next";
import { initials, site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: initials(site.name),
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f3f1ec",
    theme_color: "#f3f1ec",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
