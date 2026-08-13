import api from "./axiosClient";

export const getProductsApi = (params) =>
  api.get("/api/products", { params: params || { page: 1, limit: 100 } });

export const getFeaturedProductsApi = () => api.get("/api/products/featured");

export const getProductByIdApi = (id) => api.get(`/api/products/${id}`);

export const getRelatedProductsApi = (id) =>
  api.get(`/api/products/${id}/related`);

export const getCategoriesApi = () => api.get("/api/categories");
