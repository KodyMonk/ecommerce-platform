export type CouponDTO = {
  id: string;
  code: string;
  description?: string | null;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrderAmount?: number | null;
  maximumDiscountAmount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  perUserLimit?: number | null;
  startsAt?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  appliesToAllProducts: boolean;
  freeShipping: boolean;
};