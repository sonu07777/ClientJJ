import axios  from "axios";

const baseUrl = "http://localhost:5284";
const Authaxios = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

export default Authaxios;