import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCartApi, addCartApi, removeCartApi, removeAllCartApi } from "../../api/cartsAPi";

// 1. Fetch cart
export const fetchCart = createAsyncThunk(
  "carts/fetch",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const res = await getCartApi(userId);
      return { userId, cart: res.data };
    } catch (err: any) {
      return rejectWithValue("Fetch cart failed");
    }
  }
);

// 2. Add to cart
export const addToCart = createAsyncThunk(
  "carts/add",
  async (
    { userId, item }: { userId: string | number; item: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await addCartApi(userId, item);
      return { userId, item: res.data };
    } catch (err: any) {
      return rejectWithValue("Add to cart failed");
    }
  }
);

// 3. Remove from cart
export const removeFromCart = createAsyncThunk(
  "carts/remove",
  async (
    { userId, itemId }: { userId: string | number; itemId: number },
    { rejectWithValue }
  ) => {
    try {
     const res = await removeCartApi(userId, itemId);
      return res.data
    } catch (err: any) {
      return rejectWithValue("Remove cart failed");
    }
  }
);
export const removeAllFromCart = createAsyncThunk(
  "carts/removeAll",
  async (
    { userId, itemId }: { userId: string | number; itemId: number },
    { rejectWithValue }
  ) => {
    try {
      await removeAllCartApi(userId, itemId);
      return { itemId };
    } catch (err: any) {
      return rejectWithValue("Remove all failed");
    }
  }
);