import API from "./axios";

export const createPaymentIntent = async (amount: number) => {
  const res = await API.post("/payment/create-payment-intent", {
    amount,
  });

  return res.data; // contains clientSecret
};
