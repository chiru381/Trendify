// src/redux/slices/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  productList: {
    loading: false,
    products: [],
    pages: 1,
    page: 1,
    error: null,
  },
  productCategoryList: {
    loading: false,
    categories: [],
    error: null,
  },
  productDetailsList: {
    product: {},
    loading: false,
    error: null,
  },
  productCreate: {
    product: null,
    loading: false,
    success: false,
    error: null,
  },
  // productCreateReview: {
  //   loading: false,
  //   success: false,
  //   review: null,
  //   error: null,
  // }
};

const API_URL = "http://localhost:5000/api/products";

export const listProducts = createAsyncThunk(
  "products/listProducts",
  async (
    { pageNumber = "", seller = "", name = "", category = "", order = "", min = 0, max = 0, rating = 0 },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.get(
        `${API_URL}?pageNumber=${pageNumber}&seller=${seller}&name=${name}&category=${category}&min=${min}&max=${max}&rating=${rating}&order=${order}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const listProductCategories = createAsyncThunk(
  "products/listProductCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const detailsProduct = createAsyncThunk(
  "products/detailsProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/${productId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { userSignin: { userInfo } } = getState();
      const { data } = await axios.post(
        `${API_URL}`,
        {},
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (product, { getState, rejectWithValue }) => {
    try {
      const { userSignin: { userInfo } } = getState();
      const { data } = await axios.put(
        `${API_URL}/${product._id}`,
        product,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { userSignin: { userInfo } } = getState();
      await axios.delete(`${API_URL}/${productId}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      return productId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createReview = createAsyncThunk(
  "products/createReview",
  async ({ productId, review }, { getState, rejectWithValue }) => {
    try {
      const { userSignin: { userInfo } } = getState();
      const { data } = await axios.post(
        `${API_URL}/${productId}/reviews`,
        review,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return data.review;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetCreateProduct: (state) => {
      state.productCreate.product = null;
      state.productCreate.success = false;
      state.productCreate.error = null;
    },
    resetUpdateProduct: (state) => {
      state.success = false;
      state.error = null;
    },
    resetDeleteProduct: (state) => {
      state.success = false;
      state.error = null;
    },
    resetReviewState: (state) => {
      state.success = false;
      state.error = null;
      state.review = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listProducts.pending, (state) => {
        state.productList.loading = true;
        state.productList.error = null;
      })
      .addCase(listProducts.fulfilled, (state, action) => {
        state.productList.loading = false;
        state.productList.products = action.payload.products;
        state.productList.pages = action.payload.pages;
        state.productList.page = action.payload.page;
      })
      .addCase(listProducts.rejected, (state, action) => {
        state.productList.loading = false;
        state.productList.error = action.payload;
      })
      .addCase(listProductCategories.pending, (state) => {
        state.productCategoryList.loading = true;
        state.productCategoryList.error = null;
      })
      .addCase(listProductCategories.fulfilled, (state, action) => {
        state.productCategoryList.loading = false;
        state.productCategoryList.categories = action.payload;
      })
      .addCase(listProductCategories.rejected, (state, action) => {
        state.productCategoryList.loading = false;
        state.productCategoryList.error = action.payload;
      })
      .addCase(detailsProduct.pending, (state) => {
        state.productDetailsList.loading = true;
        state.productDetailsList.error = null;
      })
      .addCase(detailsProduct.fulfilled, (state, action) => {
        state.productDetailsList.loading = false;
        state.productDetailsList.product = action.payload;
      })
      .addCase(detailsProduct.rejected, (state, action) => {
        state.productDetailsList.loading = false;
        state.productDetailsList.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.productCreate.loading = true;
        state.productCreate.success = false;
        state.productCreate.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.productCreate.loading = false;
        state.productCreate.success = true;
        state.productCreate.product = action.payload;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.productCreate.loading = false;
        state.productCreate.error = action.payload;
      });
  },
});

// export const { resetCreateProduct } = productSlice.actions;
export default productSlice.reducer;


// useEffect(() => {
//   if (success) {
//     dispatch(resetCreateProduct()); // Reset state after creation
//   }
// }, [success, product, dispatch]);