"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminTopbar from "@/components/admin/admin-topbar";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayoutShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[272px_minmax(0,1fr)]">
        <AdminSidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className="min-w-0">
          <AdminTopbar onOpenSidebar={() => setMobileOpen(true)} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}