import axios  from "axios";

const baseUrl = "http://localhost:5001";
const Authaxios = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default Authaxios;