import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminLayoutShell from "@/components/admin/admin-layout-shell";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}