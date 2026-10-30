"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type MouseEvent } from "react";
import { scrollToTarget } from "../providers/SmoothScroll";
import { useSection } from "./sectionStore";
import { Folio } from "./Folio";
import { Mark } from "./Mark";
import { ThemeSwatch } from "./ThemeSwatch";

type Item = { id: string; label: string; hideOnSmall?: boolean };

export function Nav({
  name,
  items,
  timezone,
}: {
  name: string;
  items: Item[];
  timezone: string | null;
}) {
  const pathname = usePathname();
  const section = useSection();
  const onHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (!onHome) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    window.history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
    scrollToTarget(target);
  }

  return (
    <header
      className={`shell fixed inset-x-0 top-0 z-40 grid h-[var(--nav-h)] grid-cols-[1fr_auto] items-center gap-4 border-b bg-paper transition-colors duration-300 lg:grid-cols-[1fr_auto_1fr] ${
        scrolled ? "border-rule" : "border-transparent"
      }`}
      style={{ viewTransitionName: "site-header" }}
    >
      <Link
        href="/"
        onClick={(e) => jump(e, "top")}
        className="label inline-flex h-11 items-center gap-3"
        aria-label={`${name} — home`}
      >
        <Mark className="mark h-8 w-8 shrink-0" />
        <span className="hidden whitespace-nowrap sm:inline">{name}</span>
      </Link>

      <Folio timezone={timezone} />

      <nav aria-label="Primary" className="flex items-center justify-end gap-1 sm:gap-3">
        <ul className="flex items-center gap-1 sm:gap-4">
          {items.map((item) => {
            const active = onHome && section?.id === item.id;
            return (
              <li key={item.id} className={item.hideOnSmall ? "hidden sm:block" : undefined}>
                <Link
                  href={`/#${item.id}`}
                  onClick={(e) => jump(e, item.id)}
                  aria-current={active ? "location" : undefined}
                  className="label group relative inline-flex h-11 items-center px-2 sm:px-2.5"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-2 bottom-2 h-[2px] origin-left bg-signal transition-transform duration-300 ease-out ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <ThemeSwatch />
      </nav>
    </header>
  );
}
