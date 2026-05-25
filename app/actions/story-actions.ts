"use server";

import { getClientFingerprint } from "@/src/lib/security/fingerprint";
import { insertSubmission } from "@/src/lib/posts/repository";
import { calculateReadingTime, createExcerpt } from "@/src/data/stories";

export async function createStoryAction(formData: FormData) {
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const content = formData.get("content") as string;

  if (!title || title.trim().length === 0) {
    return { error: "El título es obligatorio" };
  }

  if (!content || content.trim().length === 0) {
    return { error: "El contenido es obligatorio" };
  }

  if (title.length > 200) {
    return { error: "El título es demasiado largo (máximo 200 caracteres)" };
  }

  if (content.length > 50000) {
    return { error: "El contenido es demasiado largo (máximo 50,000 caracteres)" };
  }

  try {
    const fingerprint = await getClientFingerprint();
    const { error } = await insertSubmission({
      post_type: "story",
      title: title.trim(),
      author: author?.trim() || "Anónimo",
      content: content.trim(),
      excerpt: createExcerpt(content.trim()),
      reading_time: calculateReadingTime(content.trim()),
      submitter_ip_hash: fingerprint.slice(0, 16),
    });

    if (error) {
      return { error: error.message || "Error al enviar la historia." };
    }

    return {
      success: true,
      pending: true,
      message:
        "Tu cuento fue enviado y está pendiente de revisión. Aparecerá en el índice cuando un administrador lo apruebe.",
    };
  } catch {
    return { error: "Error al crear la historia. Por favor, intenta de nuevo." };
  }
}

export async function createMicroPostAction(formData: FormData) {
  const type = formData.get("type") as "thought" | "phrase" | "question";
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;

  if (!type || !["thought", "phrase", "question"].includes(type)) {
    return { error: "Tipo de contenido inválido" };
  }

  if (!content || content.trim().length === 0) {
    return { error: "El contenido es obligatorio" };
  }

  if (content.length > 280) {
    return { error: "El contenido es demasiado largo (máximo 280 caracteres)" };
  }

  try {
    const fingerprint = await getClientFingerprint();
    const { error } = await insertSubmission({
      post_type: type,
      content: content.trim(),
      author: author?.trim() || "Anónimo",
      submitter_ip_hash: fingerprint.slice(0, 16),
    });

    if (error) {
      return { error: error.message || "Error al enviar el contenido." };
    }

    return {
      success: true,
      pending: true,
      message:
        "Tu envío está pendiente de revisión. Aparecerá en el índice cuando un administrador lo apruebe.",
    };
  } catch {
    return { error: "Error al crear el contenido. Por favor, intenta de nuevo." };
  }
}
