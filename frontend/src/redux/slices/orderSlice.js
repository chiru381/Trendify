import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Axios from 'axios';

const API_URL = "http://localhost:5000/api/orders";

// Helper function to get token from state
const getAuthHeader = (getState) => {
  const userInfo = getState().user?.userInfo;
  if (!userInfo || !userInfo.token) {
    console.error("Authentication token is missing!");
    return {};
  }
  return { Authorization: `Bearer ${userInfo.token}` };
};

const handleApiError = (error) => {
  return error.response?.data?.message || "Something went wrong. Please try again.";
};

// Async Thunks
export const createOrder = createAsyncThunk('order/create', async (orderData, { getState, rejectWithValue }) => {
  try {
    const headers = getAuthHeader(getState);
    const { data } = await Axios.post(`${API_URL}`, orderData, {
      headers
    });
    localStorage.removeItem('cartItems');
    return data.order;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const detailsOrder = createAsyncThunk('order/details', async (orderId, { getState, rejectWithValue }) => {
  try {
    const { data } = await Axios.get(`${API_URL}/${orderId}`, {
      headers: getAuthHeader(getState),
    });
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error));
  }
});

export const payOrder = createAsyncThunk('order/pay', async ({ orderId, paymentResult }, { getState, rejectWithValue }) => {
  try {
    const { data } = await Axios.put(`${API_URL}/${orderId}/pay`, paymentResult, {
      headers: getAuthHeader(getState),
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const listOrderMine = createAsyncThunk('order/listMine', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await Axios.get(`${API_URL}/mine`, {
      headers: getAuthHeader(getState),
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const listOrders = createAsyncThunk('order/list', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await Axios.get(`${API_URL}`, {
      headers: getAuthHeader(getState),
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deleteOrder = createAsyncThunk('order/delete', async (orderId, { getState, rejectWithValue }) => {
  try {
    await Axios.delete(`${API_URL}/${orderId}`, {
      headers: getAuthHeader(getState),
    });
    return orderId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const deliverOrder = createAsyncThunk('order/deliver', async (orderId, { getState, rejectWithValue }) => {
  try {
    const { data } = await Axios.put(`${API_URL}/${orderId}/deliver`, {}, {
      headers: getAuthHeader(getState),
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const summaryOrder = createAsyncThunk('order/summary', async (_, { getState, rejectWithValue }) => {
  try {
    const { data } = await Axios.get(`${API_URL}/summary`, {
      headers: getAuthHeader(getState),
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Order Slice
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    orders: [],
    orderDetails: null,
    summary: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.order = null;
      state.orderDetails = null;
      state.orders = [];
      state.summary = {};
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(detailsOrder.pending, (state) => { state.isLoading = true; })
      .addCase(detailsOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(detailsOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(payOrder.pending, (state) => { state.isLoading = true; })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = { ...state.orderDetails, isPaid: true };
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(listOrderMine.pending, (state) => { state.isLoading = true; })
      .addCase(listOrderMine.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(listOrderMine.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(listOrders.pending, (state) => { state.isLoading = true; })
      .addCase(listOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(listOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteOrder.pending, (state) => { state.isLoading = true; })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.filter((order) => order._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deliverOrder.pending, (state) => { state.isLoading = true; })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = { ...state.orderDetails, isDelivered: true };
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(summaryOrder.pending, (state) => { state.isLoading = true; })
      .addCase(summaryOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(summaryOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
