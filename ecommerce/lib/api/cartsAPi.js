import api from "./axiosClient";

export const getCartApi = () => api.get("/api/cart");

export const addCartApi = (data) => api.post("/api/cart/items", data);

export const updateCartItemApi = (itemId, quantity) =>
  api.patch(`/api/cart/items/${itemId}`, { quantity });

export const removeCartApi = (itemId, currentQuantity) =>
  api.patch(`/api/cart/items/${itemId}`, {
    quantity: Math.max(0, (currentQuantity || 1) - 1),
  });

export const removeAllCartApi = (itemId) =>
  api.delete(`/api/cart/items/${itemId}`);

export const clearCartApi = () => api.delete("/api/cart");
