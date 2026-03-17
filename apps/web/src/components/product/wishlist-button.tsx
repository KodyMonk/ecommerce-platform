"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

type Props = {
  productId: string;
  initiallySaved?: boolean;
};

export default function WishlistButton({
  productId,
  initiallySaved = false,
}: Props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initiallySaved);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!session?.user) {
      router.push("/login?callbackUrl=/wishlist");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update wishlist");
      }

      setSaved(data.data.added);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not update wishlist");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleToggle}
      disabled={loading}
      aria-label="Toggle wishlist"
    >
      <Heart
        className={`h-5 w-5 ${saved ? "fill-current" : ""}`}
      />
    </Button>
  );
}