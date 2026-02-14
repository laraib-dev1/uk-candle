import API from "./axios";

export interface Review {
  _id: string;
  userId: string | { _id: string; name: string; email?: string; avatar?: string };
  productId: string | { _id: string; name: string; image1?: string };
  productName: string;
  orderId: string;
  rating: number;
  comment: string;
  showOnLanding?: boolean;
  createdAt: string;
}

export interface CreateReviewData {
  productId: string;
  productName: string;
  orderId: string;
  rating: number;
  comment: string;
}

// Create review
export const createReview = async (data: CreateReviewData) => {
  const res = await API.post("/reviews", data);
  return res.data;
};

// Get user's reviews
export const getUserReviews = async (): Promise<Review[]> => {
  const res = await API.get("/reviews/my-reviews");
  return res.data.data;
};

// Get landing page reviews (public - only reviews with showOnLanding)
export const getLandingReviews = async (): Promise<Review[]> => {
  const res = await API.get("/reviews/landing");
  return res.data?.data ?? [];
};

// Toggle show on landing (admin only)
export const toggleReviewShowOnLanding = async (reviewId: string) => {
  const res = await API.patch(`/reviews/${reviewId}/show-on-landing`);
  return res.data;
};

// Get product reviews (public)
export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const res = await API.get(`/reviews/product/${productId}`);
  return res.data.data;
};

// Get all reviews (admin only)
export const getAllReviews = async (): Promise<Review[]> => {
  const res = await API.get("/reviews");
  return res.data.data;
};

// Update review (user edits own)
export const updateReview = async (reviewId: string, data: { rating?: number; comment?: string }) => {
  const res = await API.patch(`/reviews/${reviewId}`, data);
  return res.data;
};

// Delete review (admin only)
export const deleteReview = async (reviewId: string) => {
  const res = await API.delete(`/reviews/${reviewId}`);
  return res.data;
};

