import { createSlice } from "@reduxjs/toolkit";

interface CustomerState {
  customers: any[]; // Define proper type later
}

const initialState: CustomerState = {
  customers: [],
};

const customerSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    // Add reducers here
  },
});

export default customerSlice.reducer;