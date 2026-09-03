import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  getProductByIdApi,
} from "../../api/productsAPi";
import { getApiErrorMessage } from "../../api/axiosClient";
import type { Product } from "./productsSlice";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await getProductsApi({ page: 1, limit: 100 });
    return res.data.items || res.data;
  } catch (err) {
    return rejectWithValue(getApiErrorMessage(err, "Không tải được sản phẩm"));
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  number,
  { rejectValue: string }
>("products/fetchById", async (id, { rejectWithValue }) => {
  try {
    const res = await getProductByIdApi(id);
    return res.data;
  } catch (err) {
    return rejectWithValue(
      getApiErrorMessage(err, "Không tải được chi tiết sản phẩm")
    );
  }
});
