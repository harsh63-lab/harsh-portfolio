"use client";

import { useSyncExternalStore } from "react";

const subscribers = new Map<string, (callback: () => void) => () => void>();

function subscribeTo(query: string) {
  let subscribe = subscribers.get(query);
  if (!subscribe) {
    subscribe = (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    };
    subscribers.set(query, subscribe);
  }
  return subscribe;
}

export function useMedia(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeTo(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export function usePrefersReducedMotion() {
  return useMedia("(prefers-reduced-motion: reduce)");
}

export function useFinePointer() {
  return useMedia("(hover: hover) and (pointer: fine)");
}
