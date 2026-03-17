import AdminPlaceholderPage from "@/components/admin/admin-placeholder-page";

export const metadata = {
  title: "Admin Discounts",
  description: "Manage coupons and discounts",
};

export default function AdminDiscountsPage() {
  return (
    <AdminPlaceholderPage
      eyebrow="Discounts"
      title="Discounts"
      description="Coupon codes, product-specific discounts, category rules, and redemptions will be managed here."
    />
  );
}