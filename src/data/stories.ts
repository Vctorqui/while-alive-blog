import type { Story, MicroPost, Post, PostType, FilterType } from "@/src/types/story";

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñü\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function createExcerpt(content: string, maxLength: number = 120): string {
  const plainText = content.replace(/\n+/g, " ").trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + "...";
}

export const mockStories: Story[] = [
  {
    id: "1",
    type: "story",
    slug: "extrano-algo-que-ya-no-existe",
    title: "Extraño algo que ya no existe",
    content: `Extraño siluetas que ya no recuerdo, extraño olores que ya no podré oler, extraño voces que poco a poco estoy olvidando, extraño ojos que no recuerdo si eran marrones o negros. Extraño cosas que ya no existen…`,
    excerpt: "Extraño siluetas que ya no recuerdo, extraño olores que ya no podré oler...",
    author: "Anónimo",
    createdAt: new Date("2026-04-24"),
    readingTime: 1,
  },
  {
    id: "2",
    type: "story",
    slug: "instrucciones-para-subir-una-escalera",
    title: "Instrucciones para subir una escalera",
    content: `Nadie sabe realmente cómo empezó todo. Un día simplemente olvidamos.

Primero fue lo pequeño: las llaves, los nombres, las fechas. Luego fue lo importante: las caras de quienes amábamos, el sabor del primer beso, el sonido de las voces que nos arrullaron de niños.

En el Gran Archivo Central, los últimos custodios trabajan sin descanso. Escriben todo lo que aún recordamos en pequeñas tarjetas amarillas. Miles de tarjetas. Millones. Un océano de papel intentando contener lo que se nos escapa.

Hoy encontré una tarjeta en el suelo. Decía: "El cielo es azul porque las moléculas de aire dispersan la luz azul del sol más que otros colores."

Me quedé mirándola por horas. Ya no recordaba qué era el cielo. Ya no recordaba qué era el azul.

Pero la guardé de todas formas. Algunas verdades merecen existir aunque nadie las entienda.`,
    excerpt: "Nadie sabe realmente cómo empezó todo. Un día simplemente olvidamos...",
    author: "Anónimo",
    createdAt: new Date("2026-05-15"),
    readingTime: 2,
  },
  {
    id: "3",
    type: "story",
    slug: "volar-no-fue-lo-mas-difcil",
    title: "Volar no fue lo más difícil",
    content: `Nunca me había montado en un avión, antes de irme pensé que sería lo más difícil porque tenía miedo. Sin embargo, lo más difícil no fue montarse en el avión. Lo más dificil fue despegar los brazos de mi familia porque el avión ya se iba.`,
    excerpt: "Nunca me había montado en un avión, antes de irme pensé que sería lo más difícil porque tenía miedo...",
    author: "Anónimo",
    createdAt: new Date("2026-01-05"),
    readingTime: 2,
  },


];

export const mockMicroPosts: MicroPost[] = [
  {
    id: "m1",
    type: "question",
    content: "¿Cuántos sueños caben en un archivo de texto plano?",
    author: "anónimo",
    createdAt: new Date("2026-05-25"),
  },
  {
    id: "m2",
    type: "thought",
    content: "La terminal no juzga. La terminal solo espera.",
    author: "anónimo",
    createdAt: new Date("2026-05-23"),
  },
  {
    id: "m3",
    type: "question",
    content: "¿Existe un ctrl+z para las palabras que dijimos y no debimos?",
    author: "anónimo",
    createdAt: new Date("2026-05-24"),
  },

];

let stories: Story[] = [...mockStories];
let microPosts: MicroPost[] = [...mockMicroPosts];

export function getAllPosts(): Post[] {
  const allPosts: Post[] = [...stories, ...microPosts];
  return allPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getFilteredPosts(filter: FilterType): Post[] {
  const allPosts = getAllPosts();

  switch (filter) {
    case "stories":
      return allPosts.filter(p => p.type === "story");
    case "logs":
      return allPosts.filter(p => p.type !== "story");
    case "all":
    default:
      return allPosts;
  }
}


export function getAllStories(): Story[] {
  return stories.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getStoryBySlug(slug: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export function addStory(data: { title: string; author: string; content: string }): Story {
  const newStory: Story = {
    id: String(Date.now()),
    type: "story",
    slug: createSlug(data.title),
    title: data.title,
    content: data.content,
    excerpt: createExcerpt(data.content),
    author: data.author || "Anónimo",
    createdAt: new Date(),
    readingTime: calculateReadingTime(data.content),
  };

  stories = [newStory, ...stories];
  return newStory;
}

export function addMicroPost(data: {
  type: "thought" | "phrase" | "question";
  content: string;
  author: string;
}): MicroPost {
  const newMicroPost: MicroPost = {
    id: String(Date.now()),
    type: data.type,
    content: data.content,
    author: data.author || "Anónimo",
    createdAt: new Date(),
  };

  microPosts = [newMicroPost, ...microPosts];
  return newMicroPost;
}
