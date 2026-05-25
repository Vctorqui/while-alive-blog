
export type PostType = "story" | "thought" | "phrase" | "question";

export interface BasePost {
  id: string;
  type: PostType;
  author: string;
  createdAt: Date;
  likeCount?: number;
}

export interface Story extends BasePost {
  type: "story";
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  readingTime: number;
}

export interface MicroPost extends BasePost {
  type: "thought" | "phrase" | "question";
  content: string;
  title?: string;
}

export type Post = Story | MicroPost;

export function isStory(post: Post): post is Story {
  return post.type === "story";
}

export function isMicroPost(post: Post): post is MicroPost {
  return post.type !== "story";
}

export interface StoryFormData {
  title: string;
  author: string;
  content: string;
}

export interface MicroPostFormData {
  type: "thought" | "phrase" | "question";
  content: string;
  author: string;
}

export type FilterType = "all" | "stories" | "logs";
