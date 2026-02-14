import express from "express";
import { protect, isAdmin } from "../middleware/auth.js";
import {
  createReview,
  updateReview,
  getUserReviews,
  getProductReviews,
  getLandingReviews,
  getAllReviews,
  toggleReviewShowOnLanding,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

// Get landing page reviews (public - no auth)
router.get("/landing", async (req, res) => {
  try {
    const reviews = await getLandingReviews();
    res.json({ data: reviews });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get product reviews (public)
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await getProductReviews(req);
    res.json({ data: reviews });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// All routes below require authentication
router.use(protect);

// Create review
router.post("/", async (req, res) => {
  try {
    const review = await createReview(req);
    const io = req.app.get("io");
    if (io) {
      const msg = (review.productName ? `Review for ${review.productName}. ` : "") + (review.comment ? review.comment.slice(0, 80) + (review.comment.length > 80 ? "…" : "") : "");
      io.emit("admin:newReview", {
        reviewId: review._id?.toString?.() || review._id,
        title: "New review received",
        message: msg,
      });
    }
    res.json({ data: review, message: "Review submitted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's reviews
router.get("/my-reviews", async (req, res) => {
  try {
    const reviews = await getUserReviews(req);
    res.json({ data: reviews });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all reviews (admin only)
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const reviews = await getAllReviews(req);
    res.json({ data: reviews });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle show on landing (admin only)
router.patch("/:id/show-on-landing", protect, isAdmin, async (req, res) => {
  try {
    const review = await toggleReviewShowOnLanding(req);
    res.json({ data: review, message: review.showOnLanding ? "Review will show on landing page" : "Review removed from landing page" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update review (user edits own)
router.patch("/:id", async (req, res) => {
  try {
    const review = await updateReview(req);
    res.json({ data: review, message: "Review updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete review (admin only)
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const result = await deleteReview(req);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

