import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AdminProductStatusToggle from "@/components/admin/admin-product-status-toggle";
import AdminProductDeleteButton from "@/components/admin/admin-product-delete-button";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  basePrice: number | string;
  currency: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  brand: { name: string } | null;
  category: { name: string } | null;
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  variants: {
    stock: number;
  }[];
};

type Props = {
  products: ProductItem[];
};

export default function AdminProductsTable({ products }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Brand</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                No products yet.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const image =
                product.images.find((img) => img.isPrimary)?.url ||
                product.images[0]?.url ||
                "/placeholder.jpg";

              const stock =
                product.variants.length > 0
                  ? product.variants.reduce((sum, variant) => sum + variant.stock, 0)
                  : product.stock;

              return (
                <tr key={product.id} className="border-t align-top">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {product.brand ? product.brand.name : "-"}
                  </td>

                  <td className="px-4 py-4">
                    {product.category ? product.category.name : "-"}
                  </td>

                  <td className="px-4 py-4">
                    {Number(product.basePrice).toFixed(2)} {product.currency}
                  </td>

                  <td className="px-4 py-4">{stock}</td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {product.isFeatured ? (
                        <Badge variant="secondary">Featured</Badge>
                      ) : null}

                      {product.isActive ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <AdminProductStatusToggle
                        productId={product.id}
                        type="featured"
                        value={product.isFeatured}
                      />

                      <AdminProductStatusToggle
                        productId={product.id}
                        type="active"
                        value={product.isActive}
                      />

                      <Link href={`/products/${product.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          View Product
                        </Button>
                      </Link>

                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>

                      <AdminProductDeleteButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}