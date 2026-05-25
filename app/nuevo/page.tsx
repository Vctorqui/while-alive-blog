import type { Metadata } from "next";
import { NewStoryContent } from "@/src/components/stories/new-story-content";

export const metadata: Metadata = {
  title: "Escribir | while alive",
  description:
    "Comparte tu cuento con el mundo. Sin registro, sin perfiles. Solo tú y tus palabras.",
};

export default function NewStoryPage() {
  return <NewStoryContent />;
}
