import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { Footer } from "@/components/sections/HomeSections";
import { Nav } from "@/components/ui/Nav";
import { site } from "@/content/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: site.lang.replace("-", "_"),
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  // Publication is a separate decision from content: private until approved.
  robots: site.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
};

const bootScript = `(function(){var d=document.documentElement;d.classList.add("js");try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}})()`;

const navItems = [
  { id: "explorations", label: "Explore" },
  { id: "desk", label: "Desk", hideOnSmall: true },
  { id: "colophon", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${bricolage.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="label fixed left-[var(--gutter)] top-3 z-[1000] -translate-y-24 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <Nav name={site.name} items={navItems} timezone={site.timezone} />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
