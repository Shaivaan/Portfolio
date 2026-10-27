import { ImageResponse } from "next/og";
import { getPortfolio } from "@/lib/portfolio";

// The preview card shown when the site link is shared (WhatsApp, LinkedIn, X, Discord...).
// Built from the profile, so it updates whenever the profile changes in admin.

export const alt = "Shivanshu Mishra — portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const colors = {
  background: "#0b0b0c",
  foreground: "#ededed",
  muted: "#a1a1aa",
  border: "#27272a",
  accent: "#7dd3fc",
  green: "#4ade80",
};

/** Inter from Google Fonts; falls back to the built-in font if the download fails */
async function loadFont(weight: 400 | 700, text: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((res) => res.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const { profile } = await getPortfolio();
  const name = profile?.name ?? "Portfolio";
  const headline = profile?.headline ?? "";
  const meta = profile ? [profile.focusAreas.join(" · "), profile.location].filter(Boolean).join("  —  ") : "";
  // The image renderer only reads PNG and JPEG
  const photoUrl = profile?.photoUrl && /\.(jpe?g|png)$/i.test(profile.photoUrl) ? profile.photoUrl : null;

  const allText = `${name}${headline}${meta}Open to opportunities</>`;
  const [regular, bold] = await Promise.all([loadFont(400, allText), loadFont(700, allText)]);
  const fonts = [
    ...(regular ? [{ name: "Inter", data: regular, weight: 400 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "Inter", data: bold, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 60,
          padding: "70px 80px",
          background: colors.background,
          backgroundImage: `radial-gradient(circle at 85% 20%, rgba(125, 211, 252, 0.16), transparent 45%)`,
          color: colors.foreground,
          fontFamily: "Inter",
          borderBottom: `8px solid ${colors.accent}`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: colors.accent }}>{"</>"}</div>
          {profile?.openToWork && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: colors.green }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: colors.green }} />
              Open to opportunities
            </div>
          )}
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>{name}</div>
          {headline && (
            <div style={{ display: "flex", fontSize: 34, color: colors.muted, lineHeight: 1.35 }}>{headline}</div>
          )}
          {meta && <div style={{ display: "flex", fontSize: 24, color: colors.muted, marginTop: 8 }}>{meta}</div>}
        </div>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- ImageResponse only understands plain <img>
          <img
            src={photoUrl}
            alt=""
            width={300}
            height={300}
            style={{
              width: 300,
              height: 300,
              borderRadius: 150,
              objectFit: "cover",
              objectPosition: "48% 20%",
              border: `6px solid ${colors.border}`,
            }}
          />
        )}
      </div>
    ),
    { ...size, fonts: fonts.length > 0 ? fonts : undefined },
  );
}
