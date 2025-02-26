"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the structure of cart items
interface CartState {
  items: { [id: number]: number };
}

// Initial state
const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Handles adding items to cart properly
    addToCart: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      if (state.items[id]) {
        state.items[id] += 1; // Increment quantity if item exists
      } else {
        state.items[id] = 1; // Add new item with quantity 1
      }
    },

    // ✅ Removes an item from the cart
    removeFromCart: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      delete state.items[id];
    },

    // ✅ Updates quantity dynamically
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload;
      if (quantity > 0) {
        state.items[id] = quantity;
      } else {
        delete state.items[id];
      }
    },

    // ✅ Clears the entire cart after checkout
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
