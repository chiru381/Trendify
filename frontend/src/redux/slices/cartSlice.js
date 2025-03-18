import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";

// Load cart from local storage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cartItems");
  return storedCart ? JSON.parse(storedCart) : [];
};

// Async action to add an item to the cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, qty }, { getState, rejectWithValue }) => {
    try {
      const { data } = await Axios.get(`http://localhost:5000/api/products/${productId}`);

      const {
        cart: { cartItems },
      } = getState();

      if (cartItems.length > 0 && cartItems[0].seller.seller.name !== data.seller.seller.name) {
        return rejectWithValue(
          `Can't Add To Cart. Buy only from ${cartItems[0].seller.seller.name} in this order`
        );
      }

      const newItem = {
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        product: data._id,
        seller: data.seller || {},
        qty,
      };

      // Check if the item already exists in cart
      const existItem = cartItems.find((x) => x.product === newItem.product);
      const updatedCart = existItem
        ? cartItems.map((x) => (x.product === existItem.product ? newItem : x))
        : [...cartItems, newItem];

      // Save cart to local storage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));

      return updatedCart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove an item from cart
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (productId, { getState }) => {
  const {
    cart: { cartItems },
  } = getState();

  const updatedCart = cartItems.filter((x) => x.product !== productId);
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));

  return updatedCart;
});

// Save shipping address
export const saveShippingAddress = createAsyncThunk("cart/saveShippingAddress", async (data) => {
  localStorage.setItem("shippingAddress", JSON.stringify(data));
  return data;
});

// Save payment method
export const savePaymentMethod = createAsyncThunk("cart/savePaymentMethod", async (data) => {
  localStorage.setItem("paymentMethod", JSON.stringify(data));
  return data;
});

// Cart Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: loadCartFromStorage(),
    shippingAddress: JSON.parse(localStorage.getItem("shippingAddress")) || {},
    paymentMethod: localStorage.getItem("paymentMethod") || "",
    error: "",
  },
  reducers: {
    emptyCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.error = "";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.error = "";
      })
      .addCase(saveShippingAddress.fulfilled, (state, action) => {
        state.shippingAddress = action.payload;
      })
      .addCase(savePaymentMethod.fulfilled, (state, action) => {
        state.paymentMethod = action.payload;
      });
  },
});

export const { emptyCart } = cartSlice.actions;
export default cartSlice.reducer;
