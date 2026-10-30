import type { ArtifactKind } from "@/content/desk";

export const BASE_SIZE: Record<ArtifactKind, { w: number; h: number }> = {
  // Illustrations
  chip: { w: 212, h: 236 },
  terminal: { w: 284, h: 200 },
  sketchbook: { w: 212, h: 262 },
  volleyball: { w: 196, h: 220 },
  controller: { w: 264, h: 188 },
  note: { w: 236, h: 164 },
  // Real material
  sketch: { w: 220, h: 280 },
  photo: { w: 232, h: 272 },
  screen: { w: 284, h: 192 },
  detail: { w: 204, h: 236 },
  swatch: { w: 176, h: 176 },
};
