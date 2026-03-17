import { getCart } from "@/lib/cart";

export async function getCartItemCount() {
  const cart = await getCart();

  if (!cart) return 0;

  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}