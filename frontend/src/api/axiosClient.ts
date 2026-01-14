import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a custom instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Adjust to your backend URL
  withCredentials: true, // Allows sending/receiving cookies
});

export default api;
