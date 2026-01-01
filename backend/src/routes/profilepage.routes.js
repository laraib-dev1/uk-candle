import express from "express";
import {
  getProfilePages,
  getEnabledProfilePages,
  getProfilePageBySlug,
  createProfilePage,
  updateProfilePage,
  deleteProfilePage,
} from "../controllers/profilepage.controller.js";

const router = express.Router();

router.get("/", getProfilePages);
router.get("/enabled", getEnabledProfilePages);
router.post("/", createProfilePage);
router.put("/:id", updateProfilePage);
router.delete("/:id", deleteProfilePage);
router.get("/:slug", getProfilePageBySlug);

export default router;

