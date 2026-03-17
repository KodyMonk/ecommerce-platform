import { auth } from "@/auth";
import WishlistButton from "@/components/product/wishlist-button";
import { isProductInWishlist } from "@/lib/wishlist";

type Props = {
  productId: string;
};

export default async function ProductActions({ productId }: Props) {
  const session = await auth();
  const initiallySaved = session?.user
    ? await isProductInWishlist(productId)
    : false;

  return (
    <WishlistButton
      productId={productId}
      initiallySaved={initiallySaved}
    />
  );
}