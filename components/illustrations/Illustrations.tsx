// Conceptual line illustrations in the site's specimen language: ink strokes
// (currentColor) with International Orange as the single accent. They stand
// for interests — they are not pictures of anyone's work.

type Props = { className?: string };

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ChipArt({ className }: Props) {
  const pins = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g {...stroke}>
        {pins.map((i) => {
          const p = 62 + i * 15.2;
          return (
            <g key={i}>
              <path d={`M${p} 58 V40`} />
              <path d={`M${p} 142 V160`} />
              <path d={`M58 ${p} H40`} />
              <path d={`M142 ${p} H160`} />
            </g>
          );
        })}
        <rect x="58" y="58" width="84" height="84" rx="4" />
        <rect x="80" y="80" width="40" height="40" strokeDasharray="3 4" />
        <path d="M62.5 40 V24 H24 V70" />
        <path d="M168 77 H184 V150" />
        <path d="M107 160 V180 H160" />
      </g>
      <circle cx="24" cy="70" r="5" fill="var(--signal)" />
      <circle cx="184" cy="150" r="5" fill="var(--signal)" />
      <circle cx="160" cy="180" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="68" cy="68" r="3.5" fill="var(--signal)" />
    </svg>
  );
}

export function TerminalArt({ className }: Props) {
  const lines = [
    [34, 110],
    [34, 150],
    [52, 90],
    [52, 128],
    [34, 70],
  ];
  return (
    <svg viewBox="0 0 240 160" className={className} aria-hidden="true">
      <g {...stroke}>
        <rect x="8" y="8" width="224" height="144" rx="6" />
        <path d="M8 32 H232" />
        <rect x="20" y="16" width="8" height="8" />
        <rect x="34" y="16" width="8" height="8" />
        <path d="M22 50 L30 56 L22 62" />
      </g>
      {lines.map(([x, w], i) => (
        <rect key={i} x={x} y={72 + i * 14 - 22} width={w} height="5" fill="currentColor" opacity={i === 0 ? 1 : 0.55} />
      ))}
      <rect x="34" y="128" width="12" height="14" fill="var(--signal)" />
    </svg>
  );
}

export function SketchbookArt({ className }: Props) {
  const rings = [0, 1, 2, 3, 4, 5, 6];
  return (
    <svg viewBox="0 0 200 240" className={className} aria-hidden="true">
      <g {...stroke}>
        <rect x="16" y="24" width="168" height="200" rx="4" />
        {rings.map((i) => (
          <path key={i} d={`M${36 + i * 22} 34 v-16 a6 6 0 0 1 12 0 v16`} />
        ))}
        <path d="M40 176 C 64 120, 92 112, 108 140 S 150 176, 164 96" />
        <circle cx="70" cy="86" r="22" strokeDasharray="2 5" />
        <path d="M120 70 L156 70 L138 46 Z" />
      </g>
      <path d="M128 168 c 14 -14 34 -6 30 10 c -4 16 -30 18 -34 4 c -1.5 -5 0 -10 4 -14 z" fill="var(--signal)" />
    </svg>
  );
}

export function VolleyballArt({ className }: Props) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path d="M104 26 C 150 52, 166 110, 148.5 159.1 A 74 74 0 0 0 104 26 Z" fill="var(--signal)" />
      <g {...stroke}>
        <circle cx="104" cy="100" r="74" />
        <path d="M104 26 C 150 52, 166 110, 148.5 159.1" />
        <path d="M34 78 C 76 92, 128 84, 166 60" />
        <path d="M44 142 C 80 118, 118 126, 140 166" />
        <path d="M12 72 H22 M8 100 H20 M12 128 H24" />
      </g>
    </svg>
  );
}

export function ControllerArt({ className }: Props) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden="true">
      <g {...stroke}>
        <path d="M70 30 H170 C 205 30, 226 62, 230 100 C 233 128, 210 140, 192 124 L 168 100 H 72 L 48 124 C 30 140, 7 128, 10 100 C 14 62, 35 30, 70 30 Z" />
        <path d="M60 58 V86 M46 72 H74" strokeWidth="5" />
        <path d="M106 52 H118 M124 52 H136" />
      </g>
      <circle cx="176" cy="60" r="8" fill="var(--signal)" />
      <circle cx="196" cy="78" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="156" cy="78" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="176" cy="96" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function CourtArt({ className }: Props) {
  return (
    <svg viewBox="0 0 240 200" className={className} aria-hidden="true">
      <g transform="translate(0 0) scale(0.62)">
        <VolleyballInline />
      </g>
      <g transform="translate(96 108) scale(0.58)">
        <ControllerInline />
      </g>
      <path d="M20 190 H220" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
    </svg>
  );
}

function VolleyballInline() {
  return (
    <g>
      <circle cx="104" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M104 26 C 150 52, 166 110, 148.5 159.1" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M34 78 C 76 92, 128 84, 166 60" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M44 142 C 80 118, 118 126, 140 166" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="140" cy="62" r="10" fill="var(--signal)" />
    </g>
  );
}

function ControllerInline() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round">
      <path d="M70 30 H170 C 205 30, 226 62, 230 100 C 233 128, 210 140, 192 124 L 168 100 H 72 L 48 124 C 30 140, 7 128, 10 100 C 14 62, 35 30, 70 30 Z" />
      <path d="M60 58 V86 M46 72 H74" strokeWidth="6" />
      <circle cx="176" cy="66" r="9" fill="var(--signal)" stroke="none" />
      <circle cx="196" cy="84" r="8" />
    </g>
  );
}
