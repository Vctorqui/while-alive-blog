import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServiceClient } from "@/src/lib/supabase/admin";
import {
  getOrCreateVisitorId,
  visitorCookieOptions,
  VISITOR_COOKIE,
} from "@/src/lib/visitor";
import { getClientFingerprint } from "@/src/lib/security/fingerprint";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const service = createServiceClient();

  if (!service) {
    return NextResponse.json(
      { error: "Servicio de likes no configurado (SUPABASE_SERVICE_ROLE_KEY)" },
      { status: 503 }
    );
  }

  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  if (!visitorId || visitorId.length < 8) {
    visitorId = await getOrCreateVisitorId();
  }

  const fingerprint = await getClientFingerprint();

  const { data: allowed, error: rateError } = await service.rpc(
    "check_like_rate_limit",
    { p_fingerprint_hash: fingerprint }
  );

  if (rateError) {
    return NextResponse.json({ error: rateError.message }, { status: 500 });
  }

  if (!allowed) {
    return NextResponse.json(
      { error: "Demasiados likes. Intenta más tarde." },
      { status: 429 }
    );
  }

  const { data, error } = await service.rpc("toggle_post_like", {
    p_post_id: postId,
    p_visitor_key: visitorId,
    p_fingerprint_hash: fingerprint,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const result = data as { liked: boolean; likeCount: number };
  const response = NextResponse.json(result);
  response.cookies.set(visitorCookieOptions(visitorId));
  return response;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: postId } = await params;
  const service = createServiceClient();

  if (!service) {
    return NextResponse.json({ likeCount: 0, liked: false });
  }

  const cookieStore = await cookies();
  const visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  const { data: counter } = await service
    .from("post_like_counters")
    .select("like_count")
    .eq("post_id", postId)
    .maybeSingle();

  let liked = false;
  if (visitorId) {
    const { data: like } = await service
      .from("post_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("visitor_key", visitorId)
      .maybeSingle();
    liked = Boolean(like);
  }

  return NextResponse.json({
    likeCount: Number(counter?.like_count ?? 0),
    liked,
  });
}
