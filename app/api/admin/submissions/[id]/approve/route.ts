import { NextResponse } from "next/server";
import { requireAdmin } from "@/src/lib/auth/admin";
import { createClient } from "@/src/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: postId, error } = await supabase.rpc("approve_content_submission", {
    p_submission_id: id,
    p_reviewer_id: auth.user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, publishedPostId: postId });
}
