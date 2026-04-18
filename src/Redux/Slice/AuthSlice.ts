import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { data } from "react-router-dom";
import  axiosinstance  from "../../AxiosInstance/Authaxios";

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

export const login = createAsyncThunk("auths/logindata", async(data: { email: string; password: string }) => {
  try{
    const response = axiosinstance.post("api/auth/login", data);
    return (await response).data;
  }catch(error){
    console.error("Login failed:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
});

const authSlice = createSlice({
    name: "Auth",
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
          console.log("Login successful, response data:", action);
            state.isLoggedIn = true;
            state.role = action.payload?.data?.role;
            // state.data = action.payload; // Store the entire response data if needed

            // Save to localStorage
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("role", action.payload?.data?.role );
            // localStorage.setItem("data", JSON.stringify(action.payload));
        });
        builder.addCase(login.rejected, (state) => {
            state.isLoggedIn = false;
            state.role = "";
            // state.data = {};

            // Clear localStorage on failed login
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("role");
            // localStorage.removeItem("data");
        });
    }
})

export default authSlice.reducer;