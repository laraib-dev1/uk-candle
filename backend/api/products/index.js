import { getProducts, createProduct } from "../../src/controllers/product.controller.js";
import formidable from "formidable";
import os from "os";
import { withDB } from "../../src/lib/middleware.js";

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = formidable({ multiples: true, keepExtensions: true, uploadDir: os.tmpdir() });
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });

const handler = async (req, res) => {
  try {
    if (req.method === "GET") {
      const products = await getProducts();
      return res.status(200).json({ success: true, data: products });
    }

    if (req.method === "POST") {
      const { fields, files } = await parseForm(req);
      req.body = fields;
      req.files = files;

      return createProduct(req, res);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("Products API Error:", err);

    // Always set CORS headers even on error
    const FRONTEND_URL = process.env.FRONTEND_URL || "*";
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default withDB(handler);
