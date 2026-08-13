import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProductsApi,
  getProductByIdApi,
} from "../../api/productsAPi";
import type { Product } from "./productsSlice";

export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetch",
  async () => {
    const res = await getProductsApi({ page: 1, limit: 100 });
    return res.data.items || res.data;
  }
);

export const fetchProductById = createAsyncThunk<Product, number>(
  "products/fetchById",
  async (id) => {
    const res = await getProductByIdApi(id);
    return res.data;
  }
);
