import Link from "next/link";
import { getAdminProducts } from "@/lib/admin-products";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-semibold">Products</h1>

        <Link href="/admin/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="flex justify-between items-center py-4">

              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.slug}
                </p>
              </div>

              <Link href={`/admin/products/${product.id}`}>
                <Button variant="outline">Edit</Button>
              </Link>

            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}