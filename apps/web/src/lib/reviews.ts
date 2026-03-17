import { auth } from "@/auth";
import { db } from "@ecommerce/db";

export async function getCurrentReviewUser() {
  const session = await auth();

  if (!session?.user?.email) return null;

  return db.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
}

export async function getReviewsForProduct(productId: string) {
  const reviews = await db.productReview.findMany({
    where: {
      productId,
      isVisible: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  const count = reviews.length;
  const average =
    count > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
      : 0;

  return {
    reviews,
    count,
    average,
  };
}

export async function createReview(input: {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const user = await getCurrentReviewUser();

  if (!user) {
    throw new Error("You must be logged in to leave a review");
  }

  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  return db.productReview.create({
    data: {
      productId: input.productId,
      userId: user.id,
      rating: input.rating,
      title: input.title || null,
      comment: input.comment || null,
      isVisible: true,
    },
  });
}