import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 100000000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
