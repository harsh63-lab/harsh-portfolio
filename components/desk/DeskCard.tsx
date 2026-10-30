"use client";

import {
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
  type PanInfo,
} from "motion/react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import type { Artifact } from "@/content/desk";
import { ArtifactFace } from "./ArtifactFace";
import { BASE_SIZE } from "./sizes";

export type CardTarget = { x: number; y: number; rotate: number; scale: number };
export type Mover = (x: number, y: number) => void;

const SETTLE = { type: "spring", visualDuration: 0.6, bounce: 0.22 } as const;
const NUDGE = 28;
const HOLD_MS = 250;
const HOLD_SLOP = 8;
const MAX_TILT = 14;
const COS_T = Math.cos((MAX_TILT * Math.PI) / 180);
const SIN_T = Math.sin((MAX_TILT * Math.PI) / 180);

type Props = {
  artifact: Artifact;
  index: number;
  size: { w: number; h: number };
  target: CardTarget | null;
  draggable: boolean;
  entered: boolean;
  reduce: boolean;
  bounds: { width: number; height: number } | null;
  bringToFront: () => number;
  selected: boolean;
  onSelect: () => void;
  register: (id: string, mover: Mover | null) => void;
  describedBy: string;
  relatedTitle?: string;
};

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

export function DeskCard({
  artifact,
  index,
  size,
  target,
  draggable,
  entered,
  reduce,
  bounds,
  bringToFront,
  selected,
  onSelect,
  register,
  describedBy,
  relatedTitle,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const dragged = useRef(false);
  const armed = useRef(false);
  const hasEntered = useRef(false);
  const [lifted, setLifted] = useState(false);
  const [holding, setHolding] = useState(false);
  const controls = useDragControls();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const base = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);

  const vx = useVelocity(x);
  const lean = useSpring(useTransform(vx, [-1600, 0, 1600], [-12, 0, 12], { clamp: true }), {
    stiffness: 240,
    damping: 22,
  });
  const rotate = useTransform(() => base.get() + lean.get());

  // A card tilted by up to MAX_TILT pokes out of its layout box; reserve that
  // overhang so every corner stays on the desk after a throw.
  const mx = 6 + (size.w * COS_T + size.h * SIN_T - size.w) / 2;
  const my = 6 + (size.h * COS_T + size.w * SIN_T - size.h) / 2;
  const limitLeft = mx;
  const limitTop = my;
  const limitRight = bounds ? Math.max(mx, bounds.width - size.w - mx) : null;
  const limitBottom = bounds ? Math.max(my, bounds.height - size.h - my) : null;
  const limits =
    limitRight != null && limitBottom != null
      ? { left: limitLeft, top: limitTop, right: limitRight, bottom: limitBottom }
      : null;

  const tx = target?.x;
  const ty = target?.y;
  const tr = target?.rotate;
  const ts = target?.scale;

  useEffect(() => {
    if (tx == null || ty == null || tr == null || ts == null || !entered) return;

    if (reduce) {
      x.set(tx);
      y.set(ty);
      base.set(tr);
      scale.set(ts);
      opacity.set(1);
      hasEntered.current = true;
      return;
    }

    if (!hasEntered.current) {
      hasEntered.current = true;
      x.jump(tx);
      y.jump(ty - 140);
      base.jump(tr + (index % 2 ? 14 : -14));
      scale.jump(ts * 1.08);
      opacity.jump(0);
      const delay = 0.08 + index * 0.07;
      const c = [
        animate(y, ty, { ...SETTLE, delay }),
        animate(base, tr, { ...SETTLE, delay }),
        animate(scale, ts, { ...SETTLE, delay }),
        animate(opacity, 1, { duration: 0.3, delay }),
      ];
      return () => c.forEach((a) => a.stop());
    }

    const delay = index * 0.035;
    const c = [
      animate(x, tx, { ...SETTLE, delay }),
      animate(y, ty, { ...SETTLE, delay }),
      animate(base, tr, { type: "spring", visualDuration: 0.7, bounce: 0.3, delay: delay + 0.05 }),
      animate(scale, [scale.get(), ts * 1.06, ts], { duration: 0.6, times: [0, 0.35, 1], ease: "easeOut", delay }),
    ];
    return () => c.forEach((a) => a.stop());
  }, [tx, ty, tr, ts, entered, reduce, index, x, y, base, scale, opacity]);

  // Single-pointer and keyboard alternative to dragging: the Desk can move
  // this card to a point ("tap the desk to place").
  useEffect(() => {
    if (limitRight == null || limitBottom == null) {
      register(artifact.id, null);
      return;
    }
    register(artifact.id, (nx, ny) => {
      if (ref.current) ref.current.style.zIndex = String(bringToFront());
      const fx = clamp(nx, limitLeft, limitRight);
      const fy = clamp(ny, limitTop, limitBottom);
      if (reduce) {
        x.set(fx);
        y.set(fy);
      } else {
        animate(x, fx, { type: "spring", visualDuration: 0.45, bounce: 0.2 });
        animate(y, fy, { type: "spring", visualDuration: 0.45, bounce: 0.2 });
      }
    });
    return () => register(artifact.id, null);
  }, [limitLeft, limitTop, limitRight, limitBottom, reduce, artifact.id, register, bringToFront, x, y]);

  // Touch: hold to pick up, so a swipe across the desk still scrolls the page.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const block = (e: TouchEvent) => {
      if (armed.current) e.preventDefault();
    };
    el.addEventListener("touchmove", block, { passive: false });
    return () => el.removeEventListener("touchmove", block);
  }, []);

  function lift() {
    if (ref.current) ref.current.style.zIndex = String(bringToFront());
  }

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>) {
    lift();
    if (!draggable) return;
    if (e.pointerType !== "touch") {
      controls.start(e);
      return;
    }
    const native = e.nativeEvent;
    const sx = native.clientX;
    const sy = native.clientY;
    let timer = 0;
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
    };
    const onMove = (m: PointerEvent) => {
      if (m.pointerId !== native.pointerId) return;
      if (Math.hypot(m.clientX - sx, m.clientY - sy) > HOLD_SLOP) cleanup();
    };
    timer = window.setTimeout(() => {
      cleanup();
      armed.current = true;
      setHolding(true);
      if (navigator.userActivation?.hasBeenActive) navigator.vibrate?.(8);
      controls.start(native);
    }, HOLD_MS);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", cleanup);
    window.addEventListener("pointercancel", cleanup);
  }

  function release() {
    armed.current = false;
    setHolding(false);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    setLifted(false);
    release();
    if (!reduce) {
      const landed = clamp(base.get() + info.velocity.x * 0.004, -MAX_TILT + 2, MAX_TILT - 2);
      animate(base, landed, { type: "spring", visualDuration: 0.6, bounce: 0.35 });
    }
    window.setTimeout(() => {
      dragged.current = false;
    }, 0);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!draggable || !limits) return;
    const step = e.shiftKey ? NUDGE * 3 : NUDGE;
    let dx = 0;
    let dy = 0;
    if (e.key === "ArrowLeft") dx = -step;
    else if (e.key === "ArrowRight") dx = step;
    else if (e.key === "ArrowUp") dy = -step;
    else if (e.key === "ArrowDown") dy = step;
    else return;
    e.preventDefault();
    lift();
    const nx = clamp(x.get() + dx, limits.left, limits.right);
    const ny = clamp(y.get() + dy, limits.top, limits.bottom);
    if (reduce) {
      x.set(nx);
      y.set(ny);
    } else {
      animate(x, nx, { type: "spring", visualDuration: 0.25, bounce: 0.2 });
      animate(y, ny, { type: "spring", visualDuration: 0.25, bounce: 0.2 });
    }
  }

  const raised = lifted || holding;

  return (
    <motion.button
      ref={ref}
      type="button"
      className="desk-card group block text-left outline-offset-4"
      style={{
        x,
        y,
        rotate,
        opacity,
        width: size.w,
        height: size.h,
        touchAction: draggable ? "pan-y" : "manipulation",
        cursor: draggable ? (raised ? "grabbing" : "grab") : "pointer",
      }}
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragConstraints={limits ?? false}
      dragElastic={0.12}
      dragMomentum={!reduce}
      dragTransition={{ power: 0.22, timeConstant: 280, bounceStiffness: 260, bounceDamping: 22 }}
      whileDrag={{ scale: 1.05 }}
      onPointerDown={onPointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onDragStart={() => {
        dragged.current = true;
        setLifted(true);
      }}
      onDragEnd={onDragEnd}
      onClick={() => {
        if (dragged.current) return;
        onSelect();
      }}
      onKeyDown={onKeyDown}
      aria-pressed={selected}
      aria-label={`${artifact.label} ${String(index + 1).padStart(2, "0")}${relatedTitle ? `, ${relatedTitle}` : ""}`}
      aria-describedby={describedBy}
    >
      <motion.span
        className={`block h-full w-full origin-center transition-[scale,box-shadow] duration-300 ${holding ? "scale-[1.04]" : ""} ${
          raised ? "shadow-[var(--lift-shadow)]" : "shadow-[0_1px_0_rgb(0_0_0/0.06)]"
        } ${selected ? "ring-2 ring-signal ring-offset-2 ring-offset-paper-2" : ""}`}
        style={{ scale }}
      >
        <span
          className="block overflow-hidden"
          style={{
            width: BASE_SIZE[artifact.kind].w,
            height: BASE_SIZE[artifact.kind].h,
            transform: `scale(${size.w / BASE_SIZE[artifact.kind].w})`,
            transformOrigin: "top left",
          }}
        >
          <ArtifactFace artifact={artifact} index={index} />
        </span>
      </motion.span>
    </motion.button>
  );
}
