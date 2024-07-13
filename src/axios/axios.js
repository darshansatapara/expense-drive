import axios from "axios";

const member = axios.create({
  baseURL: "http://localhost:5001/api",
});

export default member;
