export type OrderStatusHistoryDTO = {
  id: string;
  status: string;
  paymentStatus?: string | null;
  fulfillmentStatus?: string | null;
  note?: string | null;
  trackingNumber?: string | null;
  shippingCarrier?: string | null;
  createdAt: string;
};

export type OrderItemDTO = {
  id: string;
  productId: string;
  productName: string;
  productSlug?: string | null;
  variantId?: string | null;
  variantTitle?: string | null;
  imageUrl?: string | null;
  sku?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderDTO = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  total: number;
  currency: string;
  couponCode?: string | null;
  trackingNumber?: string | null;
  shippingCarrier?: string | null;
  estimatedDeliveryDate?: string | null;
  shippedAt?: string | null;
  outForDeliveryAt?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  items: OrderItemDTO[];
  statusHistory: OrderStatusHistoryDTO[];
};