import connectDB from "../../src/config/db.js";
import {
  register,
  login,
  adminLogin,
  me,
  updateProfile,
  changePassword,
  updateAvatar,
} from "../../src/controllers/auth.controller.js";
import { protect } from "../../src/middleware/auth.js";
import { upload } from "../../src/middleware/upload.js";
import Cors from "micro-cors";

const cors = Cors({ allowMethods: ["GET","POST","PUT","OPTIONS"], origin: process.env.FRONTEND_URL });

function runMulter(req, res) {
  return new Promise((resolve, reject) => {
    upload.single("avatar")(req, res, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end();

  await connectDB();

  const route = req.query.route; // Vercel dynamic param: /api/auth/register => route = "register"

  try {
    if (req.method === "POST" && route === "register") return register(req, res);
    if (req.method === "POST" && route === "login") return login(req, res);
    if (req.method === "POST" && route === "admin-login") return adminLogin(req, res);

    if (req.method === "GET" && route === "me") {
      await protect(req, res);
      return me(req, res);
    }

    if (req.method === "PUT" && route === "update-profile") {
      await protect(req, res);
      return updateProfile(req, res);
    }

    if (req.method === "PUT" && route === "change-password") {
      await protect(req, res);
      return changePassword(req, res);
    }

    if (req.method === "PUT" && route === "update-avatar") {
      await protect(req, res);
      await runMulter(req, res);
      return updateAvatar(req, res);
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    console.error("Auth handler error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});
