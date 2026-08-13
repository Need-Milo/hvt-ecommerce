import api from "./axiosClient";

export const loginApi = (data) => api.post("/api/auth/login", data);
export const registerApi = (data) => api.post("/api/auth/register", data);
export const getMeApi = () => api.get("/api/auth/me");
export const logout = () => api.post("/api/auth/logout");
