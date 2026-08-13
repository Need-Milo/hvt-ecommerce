import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, createProduct, removeProduct } from "./productsThunk";


export interface Product {
  id: number;
  name: string;
  price: number;
  image: string[];
  category: string;
  type: string;
  status: string;
  stock: number;
  description: string;
  featured?: boolean;
  specifications?: Record<string, string>;
}

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}


const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Fetch products failed";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default productsSlice.reducer;
