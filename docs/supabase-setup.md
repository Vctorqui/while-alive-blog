# Supabase setup — while alive

## 1. SQL

Ejecuta los archivos en [`supabase/sql/`](../supabase/sql/) en orden (ver [README](../supabase/sql/README.md)).

**Proyecto nuevo:** `001` … `070`, luego `099` o `100`.

**Proyecto con errores RLS** (envío público o approve/publicar admin): ejecuta además [`120_rls_flow_fix.sql`](../supabase/sql/120_rls_flow_fix.sql).

Allowlist admin:

```sql
insert into public.admin_allowlist (email) values ('tu-email@gmail.com');
```

## 2. Auth (Google)

Dashboard → Authentication → Providers → Google.

Redirect URLs:

- `http://localhost:3000/auth/callback`
- `https://tu-dominio.com/auth/callback`

## 2b. Auth (correo + clave)

[`100_create_admin_user.sql`](../supabase/sql/100_create_admin_user.sql): `v_email`, `v_password`, `v_admin := true`. Crea usuario, `profiles` y allowlist.

## 3. Variables de entorno

Copia [`.env.example`](../.env.example) a `.env`:

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Cliente público (anon + sesión admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Solo servidor** — likes (`/api/posts/[id]/likes`) |
| `LIKE_FINGERPRINT_SALT` | Opcional, hash anti-abuso |

## 4. Flujos

| Flujo | Detalle |
|-------|---------|
| **Público** | Sin cuenta. `/nuevo` → `content_submissions` (`status=pending`). No aparece en home hasta aprobar. |
| **Admin** | Google o correo+clave. Email en `admin_allowlist` + fila en `profiles`. Moderar en `/admin`, publicar en `/admin/nuevo`. |
| **Likes** | Sin cuenta. Cookie `wa_visitor_id` + fingerprint. API usa service role; no expone `post_likes` al cliente. |

## 5. Verificación rápida

1. Deslogueado: enviar desde `/nuevo` → sin error RLS.
2. Admin: login → `/admin` → aprobar → post en `/`.
3. Admin: `/admin/nuevo` → publicar directo.
4. Like: contador sube/baja; cookie presente.
5. No allowlist: `/admin` → forbidden.

Si la cola admin aparece vacía pero hay envíos, revisa consola del servidor (`[fetchPendingSubmissions]`) y ejecuta `120_rls_flow_fix.sql`.
