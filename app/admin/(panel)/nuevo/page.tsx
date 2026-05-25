import type { Metadata } from "next";
import Link from "next/link";
import { AdminPublishForm } from "@/src/components/admin/admin-publish-form";

export const metadata: Metadata = {
  title: "Publicar | Admin",
  robots: { index: false, follow: false },
};

export default function AdminNewPage() {
  return (
    <div className="space-y-8">
      <header>
        <Link href="/admin" className="font-mono text-xs text-muted-foreground hover:text-foreground">
          ← moderación
        </Link>
        <h1 className="font-serif text-2xl mt-4">Publicar desde admin</h1>
        <p className="font-serif text-sm text-muted-foreground mt-2">
          Crea y publica contenido sin pasar por la cola de revisión.
        </p>
      </header>
      <AdminPublishForm />
    </div>
  );
}
