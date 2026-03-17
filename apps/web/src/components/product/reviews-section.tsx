import { auth } from "@/auth";
import ReviewForm from "@/components/product/review-form";
import { getReviewsForProduct } from "@/lib/reviews";

type Props = {
  productId: string;
};

function renderStars(rating: number) {
  const rounded = Math.round(rating);
  return "★".repeat(rounded) + "☆".repeat(5 - rounded);
}

export default async function ReviewsSection({ productId }: Props) {
  const session = await auth();
  const { reviews, count, average } = await getReviewsForProduct(productId);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border p-6">
        <h2 className="text-2xl font-semibold">Reviews</h2>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-3xl font-semibold">
            {count > 0 ? average.toFixed(1) : "0.0"}
          </p>
          <div>
            <p className="text-lg">{renderStars(average || 0)}</p>
            <p className="text-sm text-muted-foreground">
              Based on {count} review{count === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {session?.user ? (
        <ReviewForm productId={productId} />
      ) : (
        <div className="rounded-2xl border p-5 text-sm text-muted-foreground">
          Sign in to leave a review.
        </div>
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="rounded-2xl border p-5 text-sm text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {review.title || "Customer Review"}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {review.user.name || review.user.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg">{renderStars(review.rating)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {review.comment ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {review.comment}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </section>
  );
}