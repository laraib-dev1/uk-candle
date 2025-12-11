import API from "./axios"; // your configured axios instance

export const fetchOrders = async () => {
  const res = await API.get("/orders"); // backend endpoint
  return res.data;
};
