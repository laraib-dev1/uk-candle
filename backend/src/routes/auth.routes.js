import express from "express";
import { protect, isAdmin  } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { withHandler } from "../controllers/product.controller.js";

// Auth controller serverless handlers
import {
  registerUser,
  loginUser,
  adminLoginUser,
  getMe,
  updateProfileUser,
  changePasswordUser,
  updateAvatarUser,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/dashboard", protect, isAdmin, (req, res) => {
  res.json({ message: "Welcome to admin dashboard", admin: req.user });
});
// router.post("/register", withHandler(registerUser));
// router.post("/login", withHandler(loginUser));
router.post("/register", async (req, res) => {
  try {
    const data = await registerUser(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
   console.log("LOGIN BODY:", req.body);
  try {
    const data = await loginUser(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.post("/admin-login", withHandler(adminLoginUser));

// router.get("/me", protect, withHandler(getMe));
router.get("/me", protect, async (req, res) => {
  try {
    const data = await getMe(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// router.put("/update-profile", protect, withHandler(updateProfileUser));
// router.put("/change-password", protect, withHandler(changePasswordUser));

// router.put(
//   "/update-avatar",
//   protect,
//   upload.fields([{ name: "avatar", maxCount: 1 }]),
//   withHandler(updateAvatarUser)
// );
router.put("/update-profile", protect, async (req, res) => {
  try {
    const data = await updateProfileUser(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/change-password", protect, async (req, res) => {
  try {
    const data = await changePasswordUser(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/update-avatar", protect, upload.fields([{ name: "avatar", maxCount: 1 }]), async (req, res) => {
  try {
    const data = await updateAvatarUser(req);
    res.json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


export default router;
