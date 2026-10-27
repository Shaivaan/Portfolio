import { ImageResponse } from "next/og";
import { loadInter } from "./font";

const NEON = "#39ff14";

/** "SM" in neon green on a dark rounded square: the browser-tab and home-screen icon */
export async function monogramImage(px: number) {
  const font = await loadInter(800, "SM");
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
          borderRadius: px * 0.22,
          border: `${Math.max(1, Math.round(px / 32))}px solid ${NEON}`,
          color: NEON,
          fontFamily: "Inter",
          fontWeight: 800,
          fontSize: px * 0.5,
          letterSpacing: -px * 0.03,
          textShadow: `0 0 ${px * 0.08}px ${NEON}`,
        }}
      >
        SM
      </div>
    ),
    {
      width: px,
      height: px,
      fonts: font ? [{ name: "Inter", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
