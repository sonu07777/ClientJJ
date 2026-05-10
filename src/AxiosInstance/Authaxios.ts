import axios from "axios";

const baseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001"
).replace(/\/+$/, "");

const Authaxios = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default Authaxios;
