import { cookies } from "next/headers";
import { randomUUID } from "crypto";

export const VISITOR_COOKIE = "wa_visitor_id";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function getOrCreateVisitorId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(VISITOR_COOKIE)?.value;

  if (existing && existing.length >= 8) {
    return existing;
  }

  return randomUUID();
}

export function visitorCookieOptions(value: string) {
  return {
    name: VISITOR_COOKIE,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: MAX_AGE,
    path: "/",
  };
}
