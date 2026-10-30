"use client";

import { useSyncExternalStore } from "react";

export type SectionInfo = { id: string; number: string; label: string; total: number };

let current: SectionInfo | null = null;
const listeners = new Set<() => void>();

export function setSection(next: SectionInfo | null) {
  if (current?.id === next?.id && current?.total === next?.total) return;
  current = next;
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSection() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}
