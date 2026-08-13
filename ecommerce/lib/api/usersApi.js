import api from "./axiosClient";

export const getMeUserApi = () => api.get("/api/users/me");
export const updateMeUserApi = (data) => api.patch("/api/users/me", data);
