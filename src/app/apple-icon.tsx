import { monogramImage } from "@/lib/og/monogram";

// Icon used when the site is added to an iPhone/iPad home screen
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return monogramImage(size.width);
}
