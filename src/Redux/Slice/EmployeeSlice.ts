import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Authaxios from "../../AxiosInstance/Authaxios";
import type { Employee } from "../../App";

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

// ── GET /api/employees ──
export const getAllEmployees = createAsyncThunk(
  "employees/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await Authaxios.get("api/employees");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch employees");
    }
  }
);

// ── POST /api/employees ──
export const addEmployee = createAsyncThunk(
  "employees/add",
  async (employeeData: Omit<Employee, "id" | "joinDate">, { rejectWithValue }) => {
    try {
      const response = await Authaxios.post("api/employees", employeeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add employee");
    }
  }
);

// ── PUT /api/employees/{id} ──
export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, data }: { id: string; data: Partial<Employee> }, { rejectWithValue }) => {
    try {
      const response = await Authaxios.put(`api/employees/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to update employee");
    }
  }
);

// ── DELETE /api/employees/{id} ──
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await Authaxios.delete(`api/employees/${id}`);
      return id; // Return the id to remove it from state
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete employee");
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // GetAll
    builder.addCase(getAllEmployees.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllEmployees.fulfilled, (state, action) => {
      state.loading = false;
      state.employees = action.payload.data;
    });
    builder.addCase(getAllEmployees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add
    builder.addCase(addEmployee.fulfilled, (state, action) => {
      state.employees.unshift(action.payload.data);
    });

    // Update
    builder.addCase(updateEmployee.fulfilled, (state, action) => {
      const index = state.employees.findIndex((e) => e.id === action.payload.data.id);
      if (index !== -1) {
        state.employees[index] = action.payload.data;
      }
    });

    // Delete
    builder.addCase(deleteEmployee.fulfilled, (state, action) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
    });
  },
});

export default employeeSlice.reducer;
