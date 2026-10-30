import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The compact mark (see components/ui/Mark.tsx) on ink.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#121212" }}>
        <svg width="132" height="132" viewBox="0 0 32 32" fill="none" stroke="#f3f1ec">
          <path d="M8 6v20M17 6v20" strokeWidth="3.4" />
          <path d="M8 16h9M17 6.8h4.4a4.6 4.6 0 0 1 0 9.2H17" strokeWidth="1.6" />
          <circle cx="17" cy="16" r="2.5" fill="#ff4f00" stroke="none" />
        </svg>
      </div>
    ),
    size,
  );
}
