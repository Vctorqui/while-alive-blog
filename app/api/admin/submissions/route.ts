import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth/admin";
import { fetchPendingSubmissions } from "@/src/lib/posts/repository";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? "pending";

  if (status !== "pending") {
    return NextResponse.json({ error: "Solo pending soportado" }, { status: 400 });
  }

  const submissions = await fetchPendingSubmissions();
  return NextResponse.json({ submissions });
}
