import type { Metadata } from "next";
import { getAllPosts } from "@/src/data/stories";
import { HomeContent } from "@/src/components/home/home-content";

export const metadata: Metadata = {
  title: "while(alive) — Cuentos cortos y pensamientos",
  description:
    "Entre la precisión de las ideas y la imperfección de la palabra escrita. Un refugio minimalista para compartir cuentos cortos, pensamientos y preguntas en texto plano.",
};

export default function HomePage() {
  const posts = getAllPosts();

  return <HomeContent posts={posts} />;
}
