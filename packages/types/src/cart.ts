export type CartItemDTO = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string | null;
  variantId?: string | null;
  variantTitle?: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
};

export type CartDTO = {
  id: string;
  userId: string;
  items: CartItemDTO[];
  subtotal: number;
  total: number;
  currency: string;
};