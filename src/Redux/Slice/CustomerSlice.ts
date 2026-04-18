import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Authaxios from "../../AxiosInstance/Authaxios";

interface CustomerState {
  customers: any[]; // Define proper type later
}

const initialState: CustomerState = {
  customers: [],
};
interface AddCustomerData {
  success: boolean;
  message: string;
  data: Data; // Define proper type later
}

interface Data {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  joinDate: string;
  totalSpent: 0;
  products: [];
  createdAt: Date;
  updatedAt: Date;
}

interface addCustomer {
  name: string;
  email: string;
  company: string;
  phone: string;
  status: string;
  joinDate: string;
}

export const addCusstomer = createAsyncThunk(
  "api/addCustomers",
  async (data: addCustomer) => {
    try {
      const response = Authaxios.post("api/customers", data);
      return (await response)?.data;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },
);

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // Add reducers here
  },
});

export default customerSlice.reducer;
