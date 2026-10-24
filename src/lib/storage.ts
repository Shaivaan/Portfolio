import "server-only";
import { randomUUID } from "node:crypto";
import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

// All uploads (profile photo, project images, logos, resume) live in this public_read bucket.
// Endpoint and credentials come from the AWS_* vars that `neon env pull` writes to .env.local.
export const BUCKET = "portfolio-images";

export const files = new Files({ adapter: neon({ bucket: BUCKET }) });

const MAX_BYTES = 4 * 1024 * 1024;

// Allowed MIME types -> file extension used in the object key
export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

/** Thrown for bad uploads; its message is safe to show in the admin form. */
export class UploadError extends Error {}

// Public URL for a stored key. Anyone can read objects in a public_read bucket.
export function fileUrl(key: string) {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  if (!endpoint) throw new Error("AWS_ENDPOINT_URL_S3 is not set");
  return `${endpoint.replace(/\/$/, "")}/${BUCKET}/${key}`;
}

// Every upload gets a new random key, so objects never change and can be cached forever
export async function uploadFile(file: File, folder: string, allowedTypes: Record<string, string>) {
  const extension = allowedTypes[file.type];
  if (!extension) {
    throw new UploadError(`"${file.name}" is not an allowed file type.`);
  }
  if (file.size > MAX_BYTES) {
    throw new UploadError(`"${file.name}" is larger than 4 MB.`);
  }

  const key = `${folder}/${randomUUID()}.${extension}`;
  await files.upload(key, file, {
    contentType: file.type,
    cacheControl: "public, max-age=31536000, immutable",
  });
  return key;
}

// Best effort: a leftover object only wastes a little space, so never fail the request over it
export async function deleteFile(key: string | null | undefined) {
  if (!key) return;
  try {
    await files.delete(key);
  } catch (error) {
    console.error(`Failed to delete storage object "${key}"`, error);
  }
}
