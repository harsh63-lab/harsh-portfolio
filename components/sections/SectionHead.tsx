import type { ReactNode } from "react";
import { LineReveal } from "../ui/LineReveal";
import { Reveal } from "../work/Reveal";

export function SectionHead({
  number,
  title,
  titleId,
  aside,
  children,
}: {
  number: string;
  title: string;
  titleId: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="mb-12 grid grid-cols-4 gap-x-6 gap-y-6 md:mb-20 md:grid-cols-12">
      <div className="label relative col-span-4 flex items-center justify-between pb-3 text-ink-muted md:col-span-12">
        <span className="text-ink">§ {number}</span>
        {aside}
        <Reveal as="span" effect="rule-in" className="absolute inset-x-0 bottom-0 h-px bg-ink" />
      </div>
      <LineReveal as="h2" id={titleId} className="t-display fv-display col-span-4 md:col-span-8">
        {title}
      </LineReveal>
      {children && <div className="col-span-4 self-end md:col-span-4">{children}</div>}
    </header>
  );
}

export function Charset() {
  const glyphs = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 0 1 2 3 4 5 6 7 8 9 & ? ! @ № §";
  return (
    <div aria-hidden="true" className="shell overflow-hidden py-6 md:py-10">
      <p className="whitespace-nowrap text-ink-muted [mask-image:linear-gradient(to_right,#000_70%,transparent)]">
        {glyphs.split(" ").map((g, i) => (
          <span
            key={g}
            className="mr-4 inline-block text-[1.5rem] md:text-[2rem]"
            style={{ fontVariationSettings: `"wght" ${300 + ((i * 37) % 500)}, "wdth" ${75 + ((i * 11) % 26)}` }}
          >
            {g}
          </span>
        ))}
      </p>
    </div>
  );
}
