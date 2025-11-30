import {
  
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { createPaymentIntent } from "@/api/payment.api";

const StripeCardForm = ({ amount, onSuccess }: { amount: number; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    // create payment intent
    const res = await createPaymentIntent(Math.round(amount * 100));
    const clientSecret = res.clientSecret;

    // confirm card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement)!,
      },
    });

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        alert("Payment Successful!");
        onSuccess();
      }
    }

    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div>
  <label className="text-sm font-medium">Card Number</label>
  <div className="p-3 border rounded-lg">
    <CardNumberElement
      options={{
        style: {
          base: {
            fontSize: "16px",
            color: "#333",
          },
        },
      }}
    />
  </div>
</div>

<div className="grid grid-cols-2 gap-2">
  <div>
    <label className="text-sm font-medium">Expiry</label>
    <div className="p-3 border rounded-lg">
      <CardExpiryElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#333",
            },
          },
        }}
      />
    </div>
  </div>

  <div>
    <label className="text-sm font-medium">CVC</label>
    <div className="p-3 border rounded-lg">
      <CardCvcElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#333",
            },
          },
        }}
      />
    </div>
  </div>
</div>


      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-sm font-medium">Expiry</label>
          <CardExpiryElement className="p-3 border rounded-lg" />
        </div>
        <div>
          <label className="text-sm font-medium">CVC</label>
          <CardCvcElement className="p-3 border rounded-lg" />
        </div>
      </div>

      <button
        className="w-full mt-4 bg-amber-700 text-white py-3 rounded-lg"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default StripeCardForm;
