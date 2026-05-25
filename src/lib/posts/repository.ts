import { createClient } from "@/src/lib/supabase/server";
import type { DbPublishedPost, DbContentSubmission } from "@/src/types/database";
import type { Post, Story, MicroPost } from "@/src/types/story";
import {
  calculateReadingTime,
  createExcerpt,
  createSlug,
} from "@/src/data/stories";
import { normalizeSlugParam } from "@/src/lib/slug";

function mapPublishedRow(
  row: DbPublishedPost,
  likeCount = 0
): Post {
  const createdAt = new Date(row.published_at);

  if (row.post_type === "story") {
    const story: Story & { likeCount?: number } = {
      id: row.id,
      type: "story",
      slug: normalizeSlugParam(row.slug ?? createSlug(row.title ?? "")),
      title: row.title ?? "",
      content: row.content,
      excerpt: row.excerpt ?? createExcerpt(row.content),
      author: row.author,
      createdAt,
      readingTime: row.reading_time ?? calculateReadingTime(row.content),
      likeCount,
    };
    return story;
  }

  const micro: MicroPost & { likeCount?: number } = {
    id: row.id,
    type: row.post_type,
    content: row.content,
    author: row.author,
    createdAt,
    likeCount,
  };
  return micro;
}

export async function fetchPublishedPosts(): Promise<Post[]> {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("published_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !posts?.length) {
    return [];
  }

  const ids = posts.map((p: DbPublishedPost) => p.id);
  const { data: counters } = await supabase
    .from("post_like_counters")
    .select("post_id, like_count")
    .in("post_id", ids);

  const countMap = new Map(
    (counters ?? []).map((c: { post_id: string; like_count: number }) => [
      c.post_id,
      Number(c.like_count),
    ])
  );

  return (posts as DbPublishedPost[]).map((row) =>
    mapPublishedRow(row, countMap.get(row.id) ?? 0)
  );
}

export async function fetchPublishedStoryBySlug(
  slug: string
): Promise<(Story & { likeCount?: number }) | null> {
  const supabase = await createClient();
  const normalized = normalizeSlugParam(slug);
  const candidates = [...new Set([normalized, slug])];

  const { data, error } = await supabase
    .from("published_posts")
    .select("*")
    .eq("post_type", "story")
    .in("slug", candidates)
    .maybeSingle();

  if (error || !data) return null;

  const row = data as DbPublishedPost;
  const { data: counter } = await supabase
    .from("post_like_counters")
    .select("like_count")
    .eq("post_id", row.id)
    .maybeSingle();

  const post = mapPublishedRow(row, Number(counter?.like_count ?? 0));
  if (post.type !== "story") return null;
  return post;
}

export async function fetchAllStorySlugs(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("published_posts")
    .select("slug")
    .eq("post_type", "story")
    .not("slug", "is", null);

  return (data ?? [])
    .map((r: { slug: string | null }) => r.slug)
    .filter((s): s is string => Boolean(s));
}

export async function fetchPendingSubmissions(): Promise<DbContentSubmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("content_submissions")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[fetchPendingSubmissions]", error.message);
    return [];
  }
  return (data ?? []) as DbContentSubmission[];
}

export async function insertSubmission(
  payload: {
    post_type: "story" | "thought" | "phrase" | "question";
    title?: string;
    content: string;
    author: string;
    excerpt?: string;
    reading_time?: number;
    submitter_ip_hash?: string;
  },
  options: { returnId?: boolean } = {}
) {
  const supabase = await createClient();

  const row = {
    post_type: payload.post_type,
    status: "pending" as const,
    title: payload.title ?? null,
    content: payload.content,
    excerpt: payload.excerpt ?? createExcerpt(payload.content),
    author: payload.author,
    reading_time:
      payload.reading_time ??
      (payload.post_type === "story"
        ? calculateReadingTime(payload.content)
        : null),
    submitter_ip_hash: payload.submitter_ip_hash ?? null,
  };

  // anon NO tiene SELECT en content_submissions (solo admin). Encadenar
  // .select() después del insert falla con error RLS. Por defecto solo
  // insertamos; el caller admin pide el id explícitamente.
  if (!options.returnId) {
    const { error } = await supabase.from("content_submissions").insert(row);
    return { data: null as { id: string } | null, error };
  }

  const { data, error } = await supabase
    .from("content_submissions")
    .insert(row)
    .select("id")
    .single();

  return { data, error };
}
