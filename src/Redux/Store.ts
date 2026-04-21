import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slice/AuthSlice";
import customerSlice from "./Slice/CustomerSlice";
import employeeSlice from "./Slice/EmployeeSlice";

const store = configureStore({
  reducer: {
    Auth: authSlice,
    customers: customerSlice,
    employees: employeeSlice,
  },
  devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;