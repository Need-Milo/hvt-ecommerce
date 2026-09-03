import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeApi, loginApi, registerApi } from "../../api/authApi";
import { getApiErrorMessage } from "../../api/axiosClient";

const setToken = (token: string) => {
  localStorage.setItem("token", token)
  document.cookie = `token=${token}; path=/; max-age=${60 * 60}; SameSite=Lax`
}

const removeToken = () => {
  localStorage.removeItem("token")
  document.cookie = "token=; path=/; max-age=0"
}

export const loginThunk = createAsyncThunk<
  { user: any; token: string },
  { email: string; password: string }
>(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await loginApi({ email, password });
        setToken(res.data.token)   
    return {
         user: res.data.user, 
       token: res.data.token};
    } catch (err: any) {
      return rejectWithValue(
        getApiErrorMessage(err, "Sai email hoặc mật khẩu")
      );
    }
  }
);

export const registerThunk = createAsyncThunk<
  { user: any; token: string; message: string },
  { name: string; email: string; password: string; confirmPassword?: string }
>(
  "auth/register",
  async ({ name, email, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await registerApi({
        fullName: name,
        name,
        email,
        password,
        confirmPassword,
      });
      return {
        user: res.data.user,
        token: res.data.token,
        message: res.data.message,
      };
    } catch (err: any) {
      return rejectWithValue(getApiErrorMessage(err, "Đăng ký thất bại"));
    }
  }
);

export const getMeThunk = createAsyncThunk<{
  user: any; token: string
}>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMeApi();
      const token = localStorage.getItem("token");
      if (token) {
        document.cookie = `token=${token}; path=/; max-age=${60 * 60}; SameSite=Lax`;
      }
      return { user: res.data.user, token: token || res.data.token };
    } catch (err) {
       removeToken();
      return rejectWithValue(null);
    }
  }
);
export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async () => {
   removeToken()
  }
);