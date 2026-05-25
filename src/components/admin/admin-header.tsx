"use client";

import Link from "next/link";
import { createClient } from "@/src/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AdminHeader({ email }: { email: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="border-b border-border px-6 py-4 flex items-center justify-between max-w-4xl mx-auto">
      <Link href="/admin" className="font-mono text-sm text-foreground">
        admin@while-alive
      </Link>
      <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
        <span>{email}</span>
        <button
          type="button"
          onClick={handleSignOut}
          className="hover:text-foreground transition-colors"
        >
          salir
        </button>
      </div>
    </header>
  );
}
