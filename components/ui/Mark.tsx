// Harsh Pimpalapure's mark: an H–P ligature sharing one stem. Heavy stems and
// hairline crossbar/bowl echo the hero's weight range; the orange node at the
// junction is a solder joint; the crop marks are the site's specimen frame.
//
// "framed" is for the navbar and larger uses. "compact" drops the frame and
// thickens the strokes for favicon-sized placements (≤ 24px).

export function Mark({
  variant = "framed",
  className,
  title,
}: {
  variant?: "framed" | "compact";
  className?: string;
  /** Accessible name; omit when the mark sits next to the visible name. */
  title?: string;
}) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if (variant === "compact") {
    return (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className={className} {...a11y}>
        <path d="M8 6v20M17 6v20" strokeWidth="3.4" />
        <path d="M8 16h9M17 6.8h4.4a4.6 4.6 0 0 1 0 9.2H17" strokeWidth="1.6" />
        <circle cx="17" cy="16" r="2.5" fill="var(--signal)" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" className={className} {...a11y}>
      <path className="mark-frame" d="M1.5 6V1.5H6M26 1.5h4.5V6M30.5 26v4.5H26M6 30.5H1.5V26" strokeWidth="1" />
      <path d="M10 8v16M17.5 8v16" strokeWidth="2.6" />
      <path d="M10 16h7.5M17.5 8.6h3.6a3.9 3.9 0 0 1 0 7.8h-3.6" strokeWidth="1.25" />
      <circle cx="17.5" cy="16" r="1.9" fill="var(--signal)" stroke="none" />
    </svg>
  );
}
