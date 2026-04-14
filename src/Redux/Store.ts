import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slice/AuthSlice";
import customerSlice from "./Slice/CustomerSlice";

const store = configureStore({
  reducer: {
    Auth: authSlice,
    customers: customerSlice,
  },
  devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;