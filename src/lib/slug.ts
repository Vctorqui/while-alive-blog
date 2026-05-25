/** Slug ASCII-only para URLs estables (sin ñ ni acentos). */

function decodeSlugParam(slug: string): string {
  let s = slug;
  for (let i = 0; i < 2; i++) {
    try {
      const decoded = decodeURIComponent(s);
      if (decoded === s) break;
      s = decoded;
    } catch {
      break;
    }
  }
  return s;
}

export function slugify(input: string): string {
  return decodeSlugParam(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ñ/g, "n")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Normaliza el segmento de ruta `/cuento/[slug]` antes de buscar en la BD. */
export function normalizeSlugParam(slug: string): string {
  return slugify(slug);
}
