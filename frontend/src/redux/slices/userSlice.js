import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
  // userInfo: {
  //   name: '',
  //   email: '',
  //   password: ''
  // },
  users: [],
  topSellers: [],
  loading: false,
  error: null,
}

// API base URL
const API_URL = "http://localhost:5000/api/users";

// Register User
export const register = createAsyncThunk("user/register", async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, { name, email, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Signin User
export const signin = createAsyncThunk("user/signin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const { data } = await axios.post("http://localhost:5000/api/users/signin", { email, password }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    
    return data;
  } catch (error) {
    return rejectWithValue(
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    );
  }
});

// Signout User
export const signout = createAsyncThunk("user/signout", async () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  document.location.href = "/signin";
  return null;
});

// Get User Details
export const detailsUser = createAsyncThunk("user/details", async (userId, { getState, rejectWithValue }) => {
  try {
    const { userInfo } = getState().user;
    const { data } = await axios.get(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo?.token}` },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update User Profile
export const updateUserProfile = createAsyncThunk("user/updateProfile", async (user, { getState, rejectWithValue }) => {
  try {
    const { userInfo } = getState().user;
    const { data } = await axios.put(`${API_URL}/profile`, user, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Update User
export const updateUser = createAsyncThunk("user/update", async (user, { getState, rejectWithValue }) => {
  try {
    const { userInfo } = getState().user;
    const { data } = await axios.put(`${API_URL}/${user._id}`, user, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// List Users
export const listUsers = createAsyncThunk("user/list", async (_, { getState, rejectWithValue }) => {
  try {
    const { userInfo } = getState().user;
    const { data } = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// Delete User
export const deleteUser = createAsyncThunk("user/delete", async (userId, { getState, rejectWithValue }) => {
  try {
    const { userInfo } = getState().user;
    await axios.delete(`${API_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// List Top Sellers
export const listTopSellers = createAsyncThunk("user/topSellers", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/top-sellers`);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // resetError: (state) => {
    //   state.error = null;
    // },
    signout: (state) => {
      localStorage.removeItem("userInfo");
      state.userInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(signout.fulfilled, (state) => {
        state.userInfo = null;
      })

      .addCase(detailsUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(detailsUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(detailsUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(listUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(listUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
      })

      .addCase(listTopSellers.pending, (state) => {
        state.loading = true;
      })
      .addCase(listTopSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.topSellers = action.payload;
      })
      .addCase(listTopSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// export const { resetError } = userSlice.actions;
export default userSlice.reducer;
