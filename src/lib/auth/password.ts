import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";

// Hash format written by scripts/set-admin-password.mjs: "scrypt:<salt hex>:<hash hex>"

function derive(password: string, salt: Buffer, length: number) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt, length, (error, key) => (error ? reject(error) : resolve(key)));
  });
}

export async function verifyPassword(password: string) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored) {
    throw new Error("ADMIN_PASSWORD_HASH is not set. Run `npm run admin:set-password`");
  }

  const [algorithm, saltHex, hashHex] = stored.split(":");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) {
    throw new Error("ADMIN_PASSWORD_HASH is malformed. Run `npm run admin:set-password`");
  }

  const expected = Buffer.from(hashHex, "hex");
  const actual = await derive(password, Buffer.from(saltHex, "hex"), expected.length);
  // Constant-time compare so response timing doesn't leak how close a guess was
  return timingSafeEqual(actual, expected);
}
