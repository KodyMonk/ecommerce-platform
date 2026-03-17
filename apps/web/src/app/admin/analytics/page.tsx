import AdminPlaceholderPage from "@/components/admin/admin-placeholder-page";

export const metadata = {
  title: "Admin Analytics",
  description: "Store analytics overview",
};

export default function AdminAnalyticsPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Analytics"
      title="Analytics"
      description="Sales charts, order trends, traffic insights, product performance, and conversion reporting will live here."
    />
  );
}