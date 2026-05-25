import type { Metadata } from "next";
import { AdminLoginForm } from "@/src/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin | while alive",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <AdminLoginForm searchParams={searchParams} />
    </div>
  );
}
