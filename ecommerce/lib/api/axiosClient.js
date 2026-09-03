import axios from "axios";

const COLD_START_MESSAGE =
  "Máy chủ đang khởi động, vui lòng chờ một chút rồi thử lại.";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Map Axios errors to user-facing copy; keep raw error in console for debugging. */
export function getApiErrorMessage(err, fallback = "Đã có lỗi xảy ra") {
  console.error("[API]", err);

  const isTimeout =
    err?.code === "ECONNABORTED" ||
    /timeout/i.test(err?.message || "");

  const isNetwork =
    !err?.response &&
    (err?.message === "Network Error" || err?.code === "ERR_NETWORK");

  if (isTimeout || isNetwork) {
    return COLD_START_MESSAGE;
  }

  return err?.response?.data?.message || fallback;
}

export default api;
