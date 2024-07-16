const express = require("express");
const app = express();
const authRouter = require("./router/authRoutes");
const connectToMongo = require("./db/db"); // Import the function to connect to MongoDB

app.use(express.json());
app.use("/api/auth", authRouter);

const port = process.env.PORT || 5001;

// Connect to MongoDB when the server starts

connectToMongo();
app.listen(port, () => console.log(`Server running on port ${port}`));
