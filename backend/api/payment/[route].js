import Stripe from "stripe";
import Cors from "micro-cors";

const cors = Cors({ allowMethods: ["POST","OPTIONS"], origin: process.env.FRONTEND_URL });

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export default cors(async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(200).end(); // preflight

  const route = req.query.route; // e.g., "create-payment-intent"

  try {
    if (req.method === "POST" && route === "create-payment-intent") {
      if (!stripe) return res.status(400).json({ error: "Stripe key not configured" });

      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      return res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    console.error("Payment handler error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});
