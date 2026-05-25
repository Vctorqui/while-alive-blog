import { NextResponse } from "next/server";
import { fetchPublishedPosts } from "@/src/lib/posts/repository";

export async function GET() {
  const posts = await fetchPublishedPosts();
  return NextResponse.json({ posts });
}
