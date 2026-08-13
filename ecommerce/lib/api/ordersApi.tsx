import api from "./axiosClient";

export const createOrderApi = (
  _userId: string | number,
  address: string,
  phone: string,
  nameUser: string
) =>
  api.post("/api/orders", {
    receiverName: nameUser,
    phone,
    address,
  });

export const fetchOrderApi = (_userId?: string | number) =>
  api.get("/api/orders");

export const fetchOrderByIdApi = (id: string | number) =>
  api.get(`/api/orders/${id}`);
