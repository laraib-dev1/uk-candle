import { getProduct, updateProduct, deleteProduct } from "../../src/controllers/product.controller.js";
import { IncomingForm } from "formidable";
import { withDB } from "../../src/lib/middleware.js";

const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new IncomingForm({ multiples: true, keepExtensions: true, uploadDir: "/tmp" });
    form.parse(req, (err, fields, files) => (err ? reject(err) : resolve({ fields, files })));
  });

const handler = async (req, res) => {
  const { id } = req.query;

  try {
    if (req.method === "GET") {
      const product = await getProduct(id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      return res.status(200).json({ success: true, data: product });
    }

    if (req.method === "PUT") {
      const { fields, files } = await parseForm(req);
      req.body = fields;
      req.files = files;
      return updateProduct({ ...req, params: { id } }, res);
    }

    if (req.method === "DELETE") {
      return deleteProduct({ ...req, params: { id } }, res);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("Product [id] API Error:", err);

    // Always set CORS headers even on error
    const FRONTEND_URL = process.env.FRONTEND_URL || "*";
    res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default withDB(handler);
