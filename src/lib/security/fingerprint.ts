import { createHash } from "crypto";
import { headers } from "next/headers";

export async function getClientFingerprint(): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
  const ua = h.get("user-agent") || "unknown";
  const salt = process.env.LIKE_FINGERPRINT_SALT || "while-alive-likes";

  return createHash("sha256")
    .update(`${salt}:${ip}:${ua}`)
    .digest("hex");
}
