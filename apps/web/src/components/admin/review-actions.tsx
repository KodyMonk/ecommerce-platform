"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Props = {
  reviewId: string;
  isVisible: boolean;
};

export default function ReviewActions({ reviewId, isVisible }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggleVisibility() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update review");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not update review");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this review permanently?");

    if (!confirmed) return;

    try {
      setDeleting(true);

      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete review");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Could not delete review");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleToggleVisibility}
        disabled={loading}
      >
        {loading
          ? "Updating..."
          : isVisible
            ? "Hide Review"
            : "Show Review"}
      </Button>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}