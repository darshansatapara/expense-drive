const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectToMongo = require("./db/db");
const app = express();

// Allow requests from http://localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes); // Ensure this matches the baseURL configuration

connectToMongo();

const PORT = 5000; // Your backend server port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
