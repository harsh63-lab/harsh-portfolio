"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function EmailStamp({ email, placeholder }: { email: string; placeholder: boolean }) {
  const [stamp, setStamp] = useState<{ id: number; rotate: number } | null>(null);
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email address copied to clipboard");
      setStamp({ id: Date.now(), rotate: Math.round(Math.random() * 12 - 6) });
    } catch {
      setStatus("Could not copy — select the address to copy it manually");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setStamp(null);
      setStatus("");
    }, 1800);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={copy}
        className="group relative block max-w-full cursor-copy text-left"
        aria-label={`Copy email address ${email}`}
        aria-describedby="email-hint"
      >
        <span className="fv-light block text-[clamp(2rem,7.2vw,7.5rem)] leading-[0.95] tracking-[-0.04em] transition-[font-variation-settings] duration-500 [overflow-wrap:anywhere] group-hover:[font-variation-settings:'wght'_520,'wdth'_86,'opsz'_96]">
          <span className="bg-[linear-gradient(var(--signal),var(--signal))] bg-[length:0%_0.08em] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-[var(--ease-out)] group-hover:bg-[length:100%_0.08em] group-focus-visible:bg-[length:100%_0.08em]">
            {email}
          </span>
        </span>
        <span id="email-hint" className="label mt-4 flex flex-wrap items-center gap-3 text-ink-muted">
          <span className="[@media(pointer:coarse)]:hidden">Click to copy</span>
          <span className="hidden [@media(pointer:coarse)]:inline">Tap to copy</span>
          {placeholder && <span className="todo-tag">Placeholder address</span>}
        </span>

        <AnimatePresence>
          {stamp && (
            <motion.span
              key={stamp.id}
              aria-hidden="true"
              className="label pointer-events-none absolute right-[4%] top-[-0.6em] z-10 inline-flex items-center border-[3px] border-signal-text bg-paper px-4 py-2 text-[1.05rem] tracking-[0.18em] text-signal-text sm:top-[-0.2em]"
              initial={{ scale: 1.7, opacity: 0, rotate: stamp.rotate - 8 }}
              animate={{ scale: 1, opacity: 1, rotate: stamp.rotate }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
              transition={{ type: "spring", visualDuration: 0.32, bounce: 0.35 }}
            >
              Copied
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <div className="mt-6">
        {placeholder ? (
          <span className="label inline-flex min-h-11 items-center text-ink-muted">
            Mail link appears once a real address is added
          </span>
        ) : (
          <a
            href={`mailto:${email}`}
            className="label inline-flex min-h-11 items-center underline decoration-1 underline-offset-[6px] transition-colors hover:text-signal-text hover:decoration-signal"
          >
            Open in mail app
          </a>
        )}
      </div>

      <span role="status" className="sr-only">
        {status}
      </span>
    </div>
  );
}
