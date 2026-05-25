import { NextResponse } from "next/server";
import { getClientFingerprint } from "@/src/lib/security/fingerprint";
import { insertSubmission } from "@/src/lib/posts/repository";
import { createExcerpt, calculateReadingTime } from "@/src/data/stories";

const MICRO_TYPES = ["thought", "phrase", "question"] as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const postType = body.post_type as string;

    if (postType === "story") {
      const title = String(body.title ?? "").trim();
      const content = String(body.content ?? "").trim();
      const author = String(body.author ?? "").trim() || "Anónimo";

      if (!title) {
        return NextResponse.json({ error: "El título es obligatorio" }, { status: 400 });
      }
      if (!content) {
        return NextResponse.json({ error: "El contenido es obligatorio" }, { status: 400 });
      }
      if (title.length > 200) {
        return NextResponse.json({ error: "Título demasiado largo" }, { status: 400 });
      }
      if (content.length > 50000) {
        return NextResponse.json({ error: "Contenido demasiado largo" }, { status: 400 });
      }

      const fingerprint = await getClientFingerprint();
      const { data, error } = await insertSubmission({
        post_type: "story",
        title,
        content,
        author,
        excerpt: createExcerpt(content),
        reading_time: calculateReadingTime(content),
        submitter_ip_hash: fingerprint.slice(0, 16),
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        pending: true,
        id: data?.id,
        message: "Tu cuento fue enviado y está pendiente de revisión.",
      });
    }

    if (!MICRO_TYPES.includes(postType as (typeof MICRO_TYPES)[number])) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    const content = String(body.content ?? "").trim();
    const author = String(body.author ?? "").trim() || "Anónimo";

    if (!content) {
      return NextResponse.json({ error: "El contenido es obligatorio" }, { status: 400 });
    }
    if (content.length > 280) {
      return NextResponse.json({ error: "Máximo 280 caracteres" }, { status: 400 });
    }

    const fingerprint = await getClientFingerprint();
    const { data, error } = await insertSubmission({
      post_type: postType as "thought" | "phrase" | "question",
      content,
      author,
      submitter_ip_hash: fingerprint.slice(0, 16),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pending: true,
      id: data?.id,
      message: "Tu envío está pendiente de revisión.",
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
