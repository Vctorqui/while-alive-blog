export type DbPostType = "story" | "thought" | "phrase" | "question";
export type DbSubmissionStatus = "pending" | "approved" | "rejected";

export interface DbPublishedPost {
  id: string;
  submission_id: string | null;
  post_type: DbPostType;
  slug: string | null;
  title: string | null;
  content: string;
  excerpt: string | null;
  author: string;
  reading_time: number | null;
  published_at: string;
  created_at: string;
}

export interface DbContentSubmission {
  id: string;
  post_type: DbPostType;
  status: DbSubmissionStatus;
  title: string | null;
  slug: string | null;
  content: string;
  excerpt: string | null;
  author: string;
  reading_time: number | null;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  published_post_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPostLikeCounter {
  post_id: string;
  like_count: number;
}
