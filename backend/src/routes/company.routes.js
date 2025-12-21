import express from "express";
import { getCompany, updateCompany } from "../controllers/company.controller.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCompany);
router.put("/", upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]), updateCompany);

export default router;










