import AdminPlaceholderPage from "@/components/admin/admin-placeholder-page";

export const metadata = {
  title: "Admin Settings",
  description: "Store settings",
};

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Settings"
      title="Settings"
      description="Store profile, branding, shipping methods, tax settings, payment settings, and admin preferences will live here."
    />
  );
}