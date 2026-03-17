import AdminPlaceholderPage from "@/components/admin/admin-placeholder-page";

export const metadata = {
  title: "Admin Customers",
  description: "Manage store customers",
};

export default function AdminCustomersPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Customers"
      title="Customers"
      description="Customer accounts, order history, saved addresses, and segmentation will be managed here."
    />
  );
}