import { ImageResponse } from "next/og";

// Image Open Graph / Twitter générée dynamiquement (format recommandé 1200x630)
export const alt = "Worship Gift – Mouvement Gospel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #000000 0%, #1a1505 100%)",
          color: "#C9A84C",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 110, fontWeight: 700, letterSpacing: 2 }}>
          Worship Gift
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            color: "#E5E5E5",
            fontFamily: "sans-serif",
          }}
        >
          Mouvement Gospel · Adoration · Unité
        </div>
        <div
          style={{
            marginTop: 48,
            height: 4,
            width: 220,
            background: "#C9A84C",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
