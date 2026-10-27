import "server-only";

/**
 * Inter from Google Fonts, for images made with ImageResponse (share card, icons).
 * Only the glyphs in `text` are downloaded. Returns null if the download fails,
 * so the image falls back to the built-in font instead of breaking.
 */
export async function loadInter(weight: 400 | 700 | 800, text: string) {
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
