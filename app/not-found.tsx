import Link from "next/link";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center pt-[var(--nav-h)]">
      <p className="label text-ink-muted">Error № 404</p>
      <h1
        className="mt-4 text-display tracking-[-0.045em]"
        style={{ fontVariationSettings: '"wght" 200, "wdth" 75, "opsz" 96' }}
      >
        Missing glyph
      </h1>
      <p className="mt-6 max-w-md font-serif text-lead italic text-ink-muted">This page isn’t in the specimen.</p>
      <Link href="/" className="label mt-10 inline-flex min-h-11 w-fit items-center bg-ink px-4 text-paper hover:bg-signal hover:text-on-signal">
        Back to the index
      </Link>
    </section>
  );
}
