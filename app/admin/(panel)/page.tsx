import type { Metadata } from "next";
import Link from "next/link";
import { fetchPendingSubmissions } from "@/src/lib/posts/repository";
import { ModerationPanel } from "@/src/components/admin/moderation-panel";

export const metadata: Metadata = {
  title: "Moderación | while alive",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const submissions = await fetchPendingSubmissions();

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="font-serif text-2xl text-foreground">Cola de moderación</h1>
          <Link
            href="/admin/nuevo"
            className="font-mono text-xs border border-border px-3 py-1.5 hover:border-foreground"
          >
            + publicar
          </Link>
        </div>
        <p className="font-serif text-sm text-muted-foreground mt-2">
          {submissions.length === 0
            ? "No hay envíos pendientes."
            : `${submissions.length} envío(s) pendiente(s).`}
        </p>
      </header>
      <ModerationPanel submissions={submissions} />
    </div>
  );
}
