import React, { useState } from "react";
import type {AppDispatch}  from "../Redux/Store";
import { useDispatch } from "react-redux";
import { login } from "../Redux/Slice/AuthSlice";
import { useNavigate } from "react-router-dom";

function Login() {  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loginData , setLoginData] = useState<any>({
    email:"",
    password:""
  });

  function handelUserInput(event: React.ChangeEvent<HTMLInputElement>) {
    const {name , value } = event.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await dispatch(login(loginData));

    console.log("Login response:", response);
    if(response?.payload?.success){
      navigate("/home");
      alert("Login successful");
      
    }else{  
      alert("Login failed");
    }
    // console.log("Login data submitted:", response);
    setLoginData({
      email:"",
      password:""
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100  min-w-screen">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[350px]">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form noValidate onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginData.email}
              onChange={handelUserInput}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={loginData.password}
              onChange={handelUserInput}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don't have an account?
          <span className="text-blue-500 cursor-pointer ml-1">Signup</span>
        </p>
      </div>
    </div>
  );
}

export default Login;