import { createSlice } from "@reduxjs/toolkit";
import { fetchMeUser, updateMeUser } from "./usersThunk";

const usersSlice = createSlice({
  name: "users",
  initialState: { me: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeUser.fulfilled, (state, action) => {
        state.me = action.payload;
      })
      .addCase(updateMeUser.fulfilled, (state, action) => {
        state.me = action.payload;
      });
  },
});

export default usersSlice.reducer;
