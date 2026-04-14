import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isLoggedIn: localStorage.getItem("isLoggedIn") || false,
//   role: localStorage.getItem("role") || "",
// //   data:localStorage.getItem('data') !== undefined ? JSON.parse(localStorage.getItem('data')) : {}
// };
interface AuthState {
  isLoggedIn: boolean;
  role: string;
  // data?: any; // optional if you use later
}

const initialState: AuthState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  // data: localStorage.getItem("data")
  //   ? JSON.parse(localStorage.getItem("data")!)
  //   : {},
};


const authSlice = createSlice({
    name: "Auth",
    initialState,
    reducers:{}
})

export default authSlice.reducer;