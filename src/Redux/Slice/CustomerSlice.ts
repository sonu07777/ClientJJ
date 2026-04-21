import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Authaxios from "../../AxiosInstance/Authaxios";
import type { Customer, Product } from "../../App";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

// ── GET /api/customers ──
export const getAllCustomers = createAsyncThunk(
  "customers/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Authaxios.get("api/customers");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customers");
    }
  }
);

// ── POST /api/customers ──
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (customerData: Omit<Customer, "id" | "joinDate" | "totalSpent" | "products">, { rejectWithValue }) => {
    try {
      const response = await Authaxios.post("api/customers", customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add customer");
    }
  }
);

// ── PUT /api/customers/{id} ──
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }: { id: string; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const response = await Authaxios.put(`api/customers/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update customer");
    }
  }
);

// ── DELETE /api/customers/{id} ──
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await Authaxios.delete(`api/customers/${id}`);
      return id; // Return the id to remove it from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete customer");
    }
  }
);

// ── POST /api/customers/{id}/products ──
export const addProduct = createAsyncThunk(
  "customers/addProduct",
  async ({ id, productData }: { id: string; productData: Omit<Product, "id" | "purchaseDate"> }, { rejectWithValue }) => {
    try {
      const response = await Authaxios.post(`api/customers/${id}/products`, productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);

// ── DELETE /api/customers/{id}/products/{productId} ──
export const removeProduct = createAsyncThunk(
  "customers/removeProduct",
  async ({ id, productId }: { id: string; productId: string }, { rejectWithValue }) => {
    try {
      const response = await Authaxios.delete(`api/customers/${id}/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove product");
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GetAll
    builder.addCase(getAllCustomers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload.data;
    });
    builder.addCase(getAllCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.customers.unshift(action.payload.data);
    });

    // Update
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      const index = state.customers.findIndex((c) => c.id === action.payload.data.id);
      if (index !== -1) {
        state.customers[index] = action.payload.data;
      }
    });

    // Delete
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter((c) => c.id !== action.payload);
    });

    // Add Product
    builder.addCase(addProduct.fulfilled, (state, action) => {
      const index = state.customers.findIndex((c) => c.id === action.payload.data.id);
      if (index !== -1) {
        state.customers[index] = action.payload.data; // Backend returns the full updated customer
      }
    });

    // Remove Product
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      const index = state.customers.findIndex((c) => c.id === action.payload.data.id);
      if (index !== -1) {
        state.customers[index] = action.payload.data;
      }
    });
  },
});

export default customerSlice.reducer;
