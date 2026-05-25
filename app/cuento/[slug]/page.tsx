import { notFound } from "next/navigation";
import { getStoryBySlug, getAllStories } from "@/src/data/stories";
import { StoryReader } from "@/src/components/stories/story-reader";
import type { Metadata } from "next";

interface StoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    return {
      title: "Historia no encontrada | ~/cuentos_",
    };
  }

  return {
    title: `${story.title} | ~/cuentos_`,
    description: story.excerpt,
    authors: [{ name: story.author }],
    openGraph: {
      title: story.title,
      description: story.excerpt,
      type: "article",
      authors: [story.author],
      publishedTime: story.createdAt.toISOString(),
    },
  };
}

export function generateStaticParams() {
  const stories = getAllStories();
  return stories.map((story) => ({
    slug: story.slug,
  }));
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
      <StoryReader story={story} />
    </div>
  );
}
