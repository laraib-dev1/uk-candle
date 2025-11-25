import express from "express";
import * as productController from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Protected routes
router.post("/", protect, productController.createProduct);
router.put("/:id", protect, productController.updateProduct);
router.delete("/:id", protect, productController.deleteProduct);

export default router;
