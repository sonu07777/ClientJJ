import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Authaxios from "../../AxiosInstance/Authaxios";
import type { Customer, Product } from "../../App";

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  whatsAppBills: Record<
    string,
    {
      loading: boolean;
      error: string | null;
    }
  >;
  billUploads: Record<
    string,
    {
      loading: boolean;
      error: string | null;
      images: string[];
    }
  >;
}

interface SendBillImageRequest {
  customerId: string;
  phoneNumber: string;
  imageUrl: string;
  caption: string;
}

const normalizeBillUrls = (billUrls: unknown): string[] => {
  if (Array.isArray(billUrls)) {
    return billUrls.filter(
      (url): url is string => typeof url === "string" && url.length > 0,
    );
  }

  if (typeof billUrls === "string" && billUrls.length > 0) {
    return [billUrls];
  }

  return [];
};

const getCustomerBillImages = (customer: Customer): string[] => {
  const customerBillUrls = normalizeBillUrls(customer.billUrls);
  const productBillUrls = customer.products.flatMap((product) =>
    normalizeBillUrls(product.billUrls),
  );

  return Array.from(
    new Set([...customerBillUrls, ...productBillUrls]),
  ).reverse();
};

const createBillUploadsFromCustomers = (
  customers: Customer[],
  existingBillUploads: CustomerState["billUploads"],
) => {
  return customers.reduce<CustomerState["billUploads"]>((uploads, customer) => {
    const existingUpload = existingBillUploads[customer.id];

    uploads[customer.id] = {
      loading: existingUpload?.loading ?? false,
      error: existingUpload?.error ?? null,
      images: getCustomerBillImages(customer),
    };

    return uploads;
  }, {});
};

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
  whatsAppBills: {},
  billUploads: {},
};

// ── GET /api/customers ──
export const getAllCustomers = createAsyncThunk(
  "customers/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Authaxios.get("api/customers");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers",
      );
    }
  },
);

// ── POST /api/customers ──
export const addCustomer = createAsyncThunk(
  "customers/add",
  async (
    customerData: Omit<Customer, "id" | "joinDate" | "totalSpent" | "products">,
    { rejectWithValue },
  ) => {
    try {
      const response = await Authaxios.post("api/customers", customerData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add customer",
      );
    }
  },
);

// ── PUT /api/customers/{id} ──
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async (
    { id, data }: { id: string; data: Partial<Customer> },
    { rejectWithValue },
  ) => {
    try {
      const response = await Authaxios.put(`api/customers/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update customer",
      );
    }
  },
);

// ── DELETE /api/customers/{id} ──
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await Authaxios.delete(`api/customers/${id}`);
      return id; // Return the id to remove it from state
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete customer",
      );
    }
  },
);

// ── POST /api/customers/{id}/products ──
export const addProduct = createAsyncThunk(
  "customers/addProduct",
  async (
    { id, productData }: { id: string; productData: Omit<Product, "id"> },
    { rejectWithValue },
  ) => {
    try {
      const response = await Authaxios.post(
        `api/customers/${id}/products`,
        productData,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product",
      );
    }
  },
);

// ── DELETE /api/customers/{id}/products/{productId} ──
export const removeProduct = createAsyncThunk(
  "customers/removeProduct",
  async (
    { id, productId }: { id: string; productId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await Authaxios.delete(
        `api/customers/${id}/products/${productId}`,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove product",
      );
    }
  },
);

// ── POST /api/upload ──
export const uploadCustomerBill = createAsyncThunk(
  "customers/uploadBill",
  async (
    { customerId, file }: { customerId: string; file: File },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();

      formData.append("customerId", customerId);
      formData.append("file", file);
      const response = await Authaxios.post("api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data?.url || response.data?.data?.url;
      if (!imageUrl) {
        return rejectWithValue(
          "Upload succeeded but no bill image URL was returned",
        );
      }

      return {
        customerId,
        imageUrl,
        customer: response.data?.customer || response.data?.data?.customer,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to upload bill image",
      );
    }
  },
);

//whatsapp message action can be added here similarly if needed
export const sendWhatsAppBill = createAsyncThunk(
  "customers/sendWhatsAppBill",
  async (data: SendBillImageRequest, { rejectWithValue }) => {
    try {
      const response = await Authaxios.post("api/whatsapp/send-bill-image", {
        phoneNumber: data.phoneNumber,
        imageUrl: data.imageUrl,
        caption: data.caption,
      });

      return { customerId: data.customerId, response: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to send WhatsApp bill",
      );
    }
  },
);

const ensureBillUploadState = (state: CustomerState, customerId: string) => {
  if (!state.billUploads[customerId]) {
    state.billUploads[customerId] = {
      loading: false,
      error: null,
      images: [],
    };
  }

  return state.billUploads[customerId];
};

const ensureWhatsAppBillState = (state: CustomerState, customerId: string) => {
  if (!state.whatsAppBills[customerId]) {
    state.whatsAppBills[customerId] = {
      loading: false,
      error: null,
    };
  }

  return state.whatsAppBills[customerId];
};

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
      state.billUploads = createBillUploadsFromCustomers(
        action.payload.data,
        state.billUploads,
      );
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
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.data.id,
      );
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
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.data.id,
      );
      if (index !== -1) {
        state.customers[index] = action.payload.data; // Backend returns the full updated customer
      }
    });

    // Remove Product
    builder.addCase(removeProduct.fulfilled, (state, action) => {
      const index = state.customers.findIndex(
        (c) => c.id === action.payload.data.id,
      );
      if (index !== -1) {
        state.customers[index] = action.payload.data;
      }
    });

    // Upload Bill
    builder.addCase(uploadCustomerBill.pending, (state, action) => {
      const uploadState = ensureBillUploadState(
        state,
        action.meta.arg.customerId,
      );
      uploadState.loading = true;
      uploadState.error = null;
    });
    builder.addCase(uploadCustomerBill.fulfilled, (state, action) => {
      const uploadState = ensureBillUploadState(
        state,
        action.payload.customerId,
      );
      uploadState.loading = false;
      uploadState.images = Array.from(
        new Set([action.payload.imageUrl, ...uploadState.images]),
      );

      if (action.payload.customer) {
        const index = state.customers.findIndex(
          (c) => c.id === action.payload.customer.id,
        );
        if (index !== -1) {
          state.customers[index] = action.payload.customer;
        }

        uploadState.images = getCustomerBillImages(action.payload.customer);
      }
    });
    builder.addCase(uploadCustomerBill.rejected, (state, action) => {
      const uploadState = ensureBillUploadState(
        state,
        action.meta.arg.customerId,
      );
      uploadState.loading = false;
      uploadState.error = action.payload as string;
    });
    // Send WhatsApp Bill
    builder.addCase(sendWhatsAppBill.pending, (state, action) => {
      const whatsAppState = ensureWhatsAppBillState(
        state,
        action.meta.arg.customerId,
      );
      whatsAppState.loading = true;
      whatsAppState.error = null;
    });
    builder.addCase(sendWhatsAppBill.fulfilled, (state, action) => {
      const whatsAppState = ensureWhatsAppBillState(
        state,
        action.payload.customerId,
      );
      whatsAppState.loading = false;
    });
    builder.addCase(sendWhatsAppBill.rejected, (state, action) => {
      const whatsAppState = ensureWhatsAppBillState(
        state,
        action.meta.arg.customerId,
      );
      whatsAppState.loading = false;
      whatsAppState.error = action.payload as string;
    });
  },
});

export default customerSlice.reducer;
