// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import cartReducer from "./slices/cartSlice";

// const initialState = {
//   userSignin: {
//     userInfo: localStorage.getItem('userInfo')
//       ? JSON.parse(localStorage.getItem('userInfo'))
//       : null,
//   },
//   cart: {
//     cartItems: localStorage.getItem('cartItems')
//       ? JSON.parse(localStorage.getItem('cartItems'))
//       : [],
//     shippingAddress: localStorage.getItem('shippingAddress')
//       ? JSON.parse(localStorage.getItem('shippingAddress'))
//       : {},
//     paymentMethod: '',
//   },
// };

const store = configureStore({
  reducer: {
    user: userReducer,
    products: productReducer,
    order: orderReducer,
    cart: cartReducer,
  },
  // initialState
});

export default store;
