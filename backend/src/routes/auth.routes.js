import express from "express";
import { register, login, adminLogin, me } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.js";
import { updateProfile, changePassword } from "../controllers/auth.controller.js";
import { upload } from "../middleware/upload.js";
import { updateAvatar } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);       // POST /api/auth/register
router.post("/login", login);             // POST /api/auth/login
router.post("/admin-login", adminLogin);  // POST /api/auth/admin-login
router.get("/me", protect, me);  
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword); 
router.put("/update-avatar", protect, upload.single("avatar"), updateAvatar);        // GET /api/auth/me
// router.post("/forgot-password", forgotPassword); // POST /api/auth/forgot-password
// router.post("/reset-password", resetPassword);

export default router;
