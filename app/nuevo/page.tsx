import type { Metadata } from "next";
import { Suspense } from "react";
import { NewStoryContent } from "@/src/components/stories/new-story-content";

export const metadata: Metadata = {
  title: "Escribir | while alive",
  description:
    "Comparte tu cuento o pensamiento. Los envíos pasan por revisión antes de publicarse.",
};

export default function NewStoryPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-6 py-20" />}>
      <NewStoryContent />
    </Suspense>
  );
}
