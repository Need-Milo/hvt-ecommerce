import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMeUserApi, updateMeUserApi } from "../../api/usersApi";

export const fetchMeUser = createAsyncThunk("users/fetchMe", async () => {
  const res = await getMeUserApi();
  return res.data;
});

export const updateMeUser = createAsyncThunk(
  "users/updateMe",
  async (data) => {
    const res = await updateMeUserApi(data);
    return res.data;
  }
);
