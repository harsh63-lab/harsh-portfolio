"use client";

import type { MouseEvent, ReactNode } from "react";
import { scrollToTarget } from "../providers/SmoothScroll";

export function JumpLink({ to, className, children }: { to: string; className?: string; children: ReactNode }) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(to);
    if (!target) return;
    event.preventDefault();
    window.history.replaceState(null, "", `#${to}`);
    scrollToTarget(target);
  }

  return (
    <a href={`#${to}`} onClick={onClick} className={className}>
      {children}
    </a>
  );
}
