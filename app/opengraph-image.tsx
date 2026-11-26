import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#12334b", color: "white", padding: 72, alignItems: "center", position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#d4ad5c" }}><span style={{ display: "flex", width: 68, height: 68, border: "5px solid #d4ad5c", borderRadius: 12, alignItems: "center", justifyContent: "center", fontSize: 42 }}>15</span><span style={{ fontSize: 24, letterSpacing: 5, textTransform: "uppercase" }}>Meeting programs</span></div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.1 }}><span>Sacrament Meeting</span><span>Planner</span></div>
        <div style={{ display: "flex", fontSize: 28, color: "#cae2dd" }}>Plan · Organize · Review</div>
      </div>
      <div style={{ position: "absolute", right: -130, bottom: -260, width: 700, height: 700, borderRadius: 350, background: "#0f6269", opacity: 0.7 }} />
      <div style={{ position: "absolute", right: 110, top: -260, width: 520, height: 520, borderRadius: 260, border: "5px solid #d4ad5c", opacity: 0.7 }} />
    </div>, size,
  );
}
