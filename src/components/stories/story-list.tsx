import type { Story } from "@/src/types/story";
import { StoryCard } from "./story-card";

interface StoryListProps {
  stories: Story[];
}

export function StoryList({ stories }: StoryListProps) {
  if (stories.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-mono text-sm text-muted-foreground">
          <span className="text-muted-foreground/50">$</span> ls cuentos/
        </p>
        <p className="font-mono text-sm text-muted-foreground mt-2">
          (empty)
        </p>
        <p className="font-serif text-muted-foreground mt-8 text-base">
          Aún no hay historias. Sé el primero en escribir una.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}
