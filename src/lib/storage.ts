import "server-only";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

// All uploads (profile photo, project images, logos, resume) live in this public_read bucket.
// Endpoint and credentials come from the AWS_* vars that `neon env pull` writes to .env.local.
export const BUCKET = "portfolio-images";

export const files = new Files({ adapter: neon({ bucket: BUCKET }) });

// Public URL for a stored key. Anyone can read objects in a public_read bucket.
export function fileUrl(key: string) {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  if (!endpoint) throw new Error("AWS_ENDPOINT_URL_S3 is not set");
  return `${endpoint.replace(/\/$/, "")}/${BUCKET}/${key}`;
}
