import { createSlice } from "@reduxjs/toolkit";
import { fetchCart, addToCart, removeFromCart, removeAllFromCart } from "./cartsThunk";

interface CartState {
  items: any[];
  loading: boolean;
  error: string | null;
  hydrated: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  hydrated: false,
};

const cartSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.hydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.hydrated = true;
        state.items = action.payload.cart;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.hydrated = true;
        state.error = action.payload as string;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload.item
        const existing = state.items.find(i => i.id === newItem.id )
        if(existing){
          existing.quantity = newItem.quantity
        } 
        else{
          state.items.push(newItem)
        }
      })
      .addCase(removeAllFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item.id !== action.payload.itemId
        )
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
  const updated = action.payload

  const existing = state.items.find(i => i.id === updated.id)

  if (updated.quantity <= 0) {
    state.items = state.items.filter(i => i.id !== updated.id)
  } else if (existing) {
    existing.quantity = updated.quantity
  }
})

  },
  
});

export const {clearCart} = cartSlice.actions
export default cartSlice.reducer;
