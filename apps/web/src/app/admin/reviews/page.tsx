import { Star } from "lucide-react";
import ReviewActions from "@/components/admin/review-actions";
import { getAdminReviews } from "@/lib/reviews";

export const metadata = {
  title: "Admin Reviews",
  description: "Moderate product reviews",
};

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <main className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Reviews</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Moderate customer product reviews.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-3xl border bg-card p-6 shadow-sm text-sm text-muted-foreground">
            No reviews found.
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-lg font-semibold">
                      {review.title || "Customer Review"}
                    </p>

                    <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
                      <Star className="h-4 w-4" />
                      {renderStars(review.rating)}
                    </span>

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        review.isVisible
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Product:{" "}
                      <span className="font-medium text-foreground">
                        {review.product.name}
                      </span>
                    </p>
                    <p>
                      Customer:{" "}
                      <span className="font-medium text-foreground">
                        {review.user.name || review.user.email}
                      </span>
                    </p>
                    <p>{new Date(review.createdAt).toLocaleString()}</p>
                  </div>

                  {review.comment ? (
                    <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                      {review.comment}
                    </p>
                  ) : null}
                </div>

                <ReviewActions
                  reviewId={review.id}
                  isVisible={review.isVisible}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}