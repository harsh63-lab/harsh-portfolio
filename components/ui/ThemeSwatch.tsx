"use client";

import { flushSync } from "react-dom";
import { useEffect, useState, type MouseEvent } from "react";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeSwatch() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolveTheme());
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(resolveTheme());
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";

  function apply(value: Theme) {
    document.documentElement.dataset.theme = value;
    try {
      localStorage.setItem("theme", value);
    } catch {}
    setTheme(value);
  }

  function onClick(event: MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      apply(next);
      return;
    }
    const x = event.clientX || window.innerWidth - 40;
    const y = event.clientY || 32;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.style.setProperty("--vt-r", `${r}px`);
    root.classList.add("theme-vt");
    const transition = document.startViewTransition(() => {
      flushSync(() => apply(next));
    });
    transition.finished.finally(() => root.classList.remove("theme-vt"));
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative inline-flex h-11 w-11 items-center justify-center"
      aria-label={theme ? `Switch to ${next === "dark" ? "Ink (dark)" : "Paper (light)"} theme` : "Switch theme"}
    >
      <span
        aria-hidden="true"
        className="relative block h-5 w-5 overflow-hidden rounded-full border border-ink transition-transform duration-300 ease-out group-hover:rotate-180"
      >
        <span className="absolute inset-y-0 left-0 w-1/2 bg-ink" />
        <span className="absolute inset-y-0 right-0 w-1/2 bg-paper" />
      </span>
    </button>
  );
}
