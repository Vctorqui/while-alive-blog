"use server";

import { requireAdmin } from "@/src/lib/auth/admin";
import { createClient } from "@/src/lib/supabase/server";
import { insertSubmission } from "@/src/lib/posts/repository";
import { calculateReadingTime, createExcerpt } from "@/src/data/stories";
import { normalizeSlugParam } from "@/src/lib/slug";

export async function adminPublishStoryAction(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "Anónimo";

  if (!title || !content) {
    return { error: "Título y contenido son obligatorios" };
  }

  const { data: sub, error: insertError } = await insertSubmission(
    {
      post_type: "story",
      title,
      content,
      author,
      excerpt: createExcerpt(content),
      reading_time: calculateReadingTime(content),
    },
    { returnId: true }
  );

  if (insertError || !sub?.id) {
    return { error: insertError?.message ?? "Error al crear" };
  }

  const supabase = await createClient();
  const { data: postId, error: approveError } = await supabase.rpc(
    "approve_content_submission",
    {
      p_submission_id: sub.id,
      p_reviewer_id: auth.user.id,
    }
  );

  if (approveError) {
    return { error: approveError.message };
  }

  const { data: post } = await supabase
    .from("published_posts")
    .select("slug")
    .eq("id", postId)
    .single();

  return {
    success: true,
    slug: post?.slug
      ? normalizeSlugParam(post.slug as string)
      : undefined,
  };
}

export async function adminPublishMicroAction(formData: FormData) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return { error: auth.error };
  }

  const type = formData.get("type") as "thought" | "phrase" | "question";
  const content = (formData.get("content") as string)?.trim();
  const author = (formData.get("author") as string)?.trim() || "Anónimo";

  if (!content || !["thought", "phrase", "question"].includes(type)) {
    return { error: "Datos inválidos" };
  }

  const { data: sub, error: insertError } = await insertSubmission(
    {
      post_type: type,
      content,
      author,
    },
    { returnId: true }
  );

  if (insertError || !sub?.id) {
    return { error: insertError?.message ?? "Error al crear" };
  }

  const supabase = await createClient();
  const { error: approveError } = await supabase.rpc("approve_content_submission", {
    p_submission_id: sub.id,
    p_reviewer_id: auth.user.id,
  });

  if (approveError) {
    return { error: approveError.message };
  }

  return { success: true };
}
