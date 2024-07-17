import axios from "axios";

const member = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default member;
