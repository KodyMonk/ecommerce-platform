"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  productId: string;
};

export default function ReviewForm({ productId }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState("5");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      router.push(`/login?callbackUrl=/products/${productId}`);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating: Number(rating),
          title,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review");
      }

      setRating("5");
      setTitle("");
      setComment("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border p-5">
      <h3 className="text-lg font-semibold">Write a Review</h3>

      <div>
        <label className="mb-2 block text-sm font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Very good</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>
      </div>

      <Input
        placeholder="Review title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product"
        className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}