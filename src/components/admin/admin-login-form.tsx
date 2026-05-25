"use client";

import { use, useState } from "react";
import type { FormEvent } from "react";
import { createClient } from "@/src/lib/supabase/client";

interface AdminLoginFormProps {
  searchParams: Promise<{ error?: string; next?: string }>;
}

export function AdminLoginForm({ searchParams }: AdminLoginFormProps) {
  const params = use(searchParams);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(() => {
    if (params.error === "auth") return "No se pudo completar el inicio de sesión.";
    if (params.error === "forbidden")
      return "Tu cuenta no está autorizada como administrador.";
    return null;
  });

  const handleGoogleLogin = async () => {
    setOauthLoading(true);
    setError(null);
    const supabase = createClient();
    const next = params.next || "/admin";
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (signInError) {
      setError(signInError.message);
      setOauthLoading(false);
    }
  };

  const handlePasswordLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPasswordLoading(true);
    const supabase = createClient();
    const next = params.next || "/admin";

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setPasswordLoading(false);
      return;
    }

    window.location.assign(next);
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-2xl text-foreground">Panel administrativo</h1>
        <p className="font-serif text-sm text-muted-foreground mt-2">
          Inicia sesión con Google o con correo y clave. Solo cuentas en la lista
          de administradores pueden acceder.
        </p>
      </header>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </p>
      )}

      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="admin-email" className="text-sm font-serif text-foreground">
            Correo
          </label>
          <input
            id="admin-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="admin-password"
            className="text-sm font-serif text-foreground"
          >
            Clave
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-foreground"
          />
        </div>

        <button
          type="submit"
          disabled={passwordLoading || oauthLoading}
          className="w-full font-serif text-sm bg-foreground text-background px-6 py-3 hover:opacity-80 disabled:opacity-50"
        >
          {passwordLoading ? "Ingresando…" : "Entrar con correo y clave"}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
            o
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={oauthLoading || passwordLoading}
        className="w-full font-serif text-sm bg-foreground text-background px-6 py-3 hover:opacity-80 disabled:opacity-50"
      >
        {oauthLoading ? "Redirigiendo…" : "Continuar con Google"}
      </button>
    </div>
  );
}
