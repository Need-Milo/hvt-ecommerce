import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCartApi,
  addCartApi,
  removeCartApi,
  removeAllCartApi,
} from "../../api/cartsAPi";
import { getApiErrorMessage } from "../../api/axiosClient";

export const fetchCart = createAsyncThunk(
  "carts/fetch",
  async (userId: string | number, { rejectWithValue }) => {
    try {
      const res = await getCartApi();
      return { userId, cart: res.data.items || [] };
    } catch (err: any) {
      return rejectWithValue(
        getApiErrorMessage(err, "Không tải được giỏ hàng")
      );
    }
  },
  {
    condition: (_userId, { getState }) => {
      const state: any = getState();
      return !state.carts.loading;
    },
  }
);

export const addToCart = createAsyncThunk(
  "carts/add",
  async (
    { userId, item }: { userId: string | number; item: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await addCartApi({
        productId: item.productId,
        quantity: item.quantity || 1,
      });
      return { userId, item: res.data };
    } catch (err: any) {
      return rejectWithValue(
        getApiErrorMessage(err, "Không thêm được vào giỏ hàng")
      );
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "carts/remove",
  async (
    {
      userId,
      itemId,
      quantity,
    }: { userId: string | number; itemId: number; quantity?: number },
    { rejectWithValue, getState }
  ) => {
    try {
      const state: any = getState();
      const current =
        quantity ??
        state.carts.items.find((i: any) => i.id === itemId)?.quantity ??
        1;
      const res = await removeCartApi(itemId, current);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(getApiErrorMessage(err, "Không xóa được sản phẩm"));
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
      await removeAllCartApi(itemId);
      return { itemId };
    } catch (err: any) {
      return rejectWithValue(getApiErrorMessage(err, "Không xóa được sản phẩm"));
    }
  }
);
