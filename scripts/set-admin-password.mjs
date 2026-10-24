// Usage: npm run admin:set-password
// Asks for a new admin password, hashes it with scrypt and writes ADMIN_PASSWORD_HASH
// (and SESSION_SECRET, if missing) into .env.local. The plain password is never saved.

import { randomBytes, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// Keep in sync with src/lib/auth/password.ts
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const MIN_LENGTH = 10;
const ENV_FILE = ".env.local";

// Characters typed (or piped) past the end of the previous answer
let leftover = "";

// Reads one line without echoing it; shows "*" per character instead
function ask(question) {
  return new Promise((resolve) => {
    const { stdin, stdout } = process;
    stdout.write(question);
    let input = "";

    const finish = (rest) => {
      stdin.setRawMode?.(false);
      stdin.pause();
      stdin.off("data", onData);
      stdout.write("\n");
      leftover = rest.replace(/^\n/, ""); // drop the "\n" of a "\r\n" pair
      resolve(input);
    };

    const handle = (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        const char = chunk[i];
        if (char === "\r" || char === "\n" || char === "\u0004") {
          finish(chunk.slice(i + 1));
          return true;
        } else if (char === "\u0003") {
          stdout.write("\n");
          process.exit(1);
        } else if (char === "\u0008" || char === "\u007f") {
          if (input.length > 0) {
            input = input.slice(0, -1);
            stdout.write("\b \b");
          }
        } else {
          input += char;
          stdout.write("*");
        }
      }
      return false;
    };

    const onData = (chunk) => handle(chunk);

    const pending = leftover;
    leftover = "";
    if (handle(pending)) return;

    stdin.setRawMode?.(true);
    stdin.setEncoding("utf8");
    stdin.on("data", onData);
    stdin.resume();
  });
}

function setEnvVar(content, name, value) {
  const line = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, "m");
  if (pattern.test(content)) return content.replace(pattern, line);
  return `${content.replace(/\n*$/, "")}\n${line}\n`;
}

const password = await ask("New admin password: ");
if (password.length < MIN_LENGTH) {
  console.error(`Password must be at least ${MIN_LENGTH} characters.`);
  process.exit(1);
}
const confirm = await ask("Confirm password:   ");
if (password !== confirm) {
  console.error("Passwords do not match.");
  process.exit(1);
}

const salt = randomBytes(SALT_BYTES);
const hash = scryptSync(password, salt, KEY_LENGTH);
// ":" separators, not "$": Next.js expands $VARS inside .env files
const encoded = `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;

let env = existsSync(ENV_FILE) ? readFileSync(ENV_FILE, "utf8") : "";
env = setEnvVar(env, "ADMIN_PASSWORD_HASH", encoded);
const hadSecret = /^SESSION_SECRET=.+$/m.test(env);
if (!hadSecret) env = setEnvVar(env, "SESSION_SECRET", randomBytes(32).toString("base64url"));
writeFileSync(ENV_FILE, env);

console.log(`✓ ADMIN_PASSWORD_HASH saved to ${ENV_FILE}`);
if (!hadSecret) console.log(`✓ SESSION_SECRET generated in ${ENV_FILE}`);
console.log("On Vercel, update these env vars too and redeploy.");
