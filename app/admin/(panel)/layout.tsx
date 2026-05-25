import { redirect } from "next/navigation";
import { getSessionUser, isCurrentUserAdmin } from "@/src/lib/auth/admin";
import { AdminHeader } from "@/src/components/admin/admin-header";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/admin/login");
  }

  const admin = await isCurrentUserAdmin();
  if (!admin) {
    redirect("/admin/login?error=forbidden");
  }

  return (
    <div className="min-h-screen">
      <AdminHeader email={user.email ?? ""} />
      <div className="max-w-4xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
