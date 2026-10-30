export function GridRules({ columns = 12 }: { columns?: number }) {
  return (
    <div aria-hidden="true" className="shell pointer-events-none absolute inset-0 -z-10">
      <div className="grid-rules relative h-full">
        {Array.from({ length: columns + 1 }, (_, i) => (
          <span
            key={i}
            className={`absolute inset-y-0 w-px bg-rule ${i % 3 !== 0 ? "hidden md:block" : ""}`}
            style={{ left: `${(i / columns) * 100}%`, ["--i" as string]: i }}
          />
        ))}
      </div>
    </div>
  );
}
