"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSection } from "./sectionStore";

export function Folio({ timezone }: { timezone: string | null }) {
  const section = useSection();

  return (
    <div className="label hidden items-center gap-3 text-ink-muted lg:flex" aria-hidden="true">
      <span className="inline-block h-2 w-2 bg-signal" />
      <span className="relative inline-flex h-[1.3em] w-[24ch] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          {section && (
            <motion.span
              key={section.id}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ type: "spring", visualDuration: 0.35, bounce: 0.1 }}
              className="whitespace-nowrap text-ink"
            >
              {section.number} / {String(section.total).padStart(2, "0")} — {section.label}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {timezone && <LocalTime timezone={timezone} />}
    </div>
  );
}

function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", timeZone: timezone });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [timezone]);

  // Space is reserved before the time is known, so nothing shifts on mount.
  return (
    <span className="hidden min-w-[17ch] whitespace-nowrap tabular-nums xl:inline">
      · Local time {time ?? "--:--"}
    </span>
  );
}
