import express from "express";
import multer from "multer";
import { getCompany, updateCompany } from "../controllers/company.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getCompany);
router.put("/", upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
]), updateCompany);

export default router;







