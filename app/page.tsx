import type { Metadata } from "next";
import { fetchPublishedPosts } from "@/src/lib/posts/repository";
import { HomeContent } from "@/src/components/home/home-content";

export const metadata: Metadata = {
  title: "while(alive) — Cuentos cortos y pensamientos",
  description:
    "Entre la precisión de las ideas y la imperfección de la palabra escrita. Un refugio minimalista para compartir cuentos cortos, pensamientos y preguntas en texto plano.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await fetchPublishedPosts();

  return <HomeContent posts={posts} />;
}
