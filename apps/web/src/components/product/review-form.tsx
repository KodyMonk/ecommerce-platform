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
    <section className="border-t border-neutral-200 pt-12">
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
              Customer Feedback
            </p>
            <h2 className="mt-3 text-3xl font-semibold uppercase tracking-[0.08em]">
              Reviews
            </h2>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-5xl font-semibold text-neutral-900">
              {count > 0 ? average.toFixed(1) : "0.0"}
            </p>
            <p className="mt-3 text-xl tracking-[0.15em] text-neutral-800">
              {renderStars(average || 0)}
            </p>
            <p className="mt-3 text-sm text-neutral-500">
              Based on {count} review{count === 1 ? "" : "s"}
            </p>
          </div>

          {session?.user ? (
            <ReviewForm productId={productId} />
          ) : (
            <div className="border border-neutral-200 p-5 text-sm text-neutral-500">
              Sign in to leave a review.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="border border-neutral-200 p-6 text-sm text-neutral-500">
              No reviews yet.
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border border-neutral-200 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.16em] text-neutral-500">
                      {review.user.name || review.user.email}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                      {review.title || "Customer Review"}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-lg tracking-[0.15em] text-neutral-900">
                      {renderStars(review.rating)}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {review.comment ? (
                  <p className="mt-4 text-sm leading-7 text-neutral-600">
                    {review.comment}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}