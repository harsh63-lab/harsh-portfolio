import {
  ColophonSection,
  ContactSection,
  DeskSection,
  ExplorationsSection,
  ToolkitSection,
  WorkSection,
} from "@/components/sections/HomeSections";
import { Hero } from "@/components/specimen/Hero";
import { SectionTracker } from "@/components/ui/SectionTracker";
import { desk } from "@/content/desk";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  // Sections number themselves, so optional ones (Work, Desk) can come and go.
  const order = [
    "explorations",
    projects.length ? "work" : null,
    site.skills.length ? "toolkit" : null,
    desk.enabled ? "desk" : null,
    "colophon",
    "contact",
  ].filter(Boolean) as string[];
  const n = (key: string) => String(order.indexOf(key) + 2).padStart(2, "0");

  return (
    <SectionTracker>
      <Hero />
      <ExplorationsSection number={n("explorations")} />
      <WorkSection number={n("work")} />
      <ToolkitSection number={n("toolkit")} />
      <DeskSection number={n("desk")} />
      <ColophonSection number={n("colophon")} />
      <ContactSection number={n("contact")} />
    </SectionTracker>
  );
}
