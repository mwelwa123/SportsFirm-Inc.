const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authmiddleware = require("./middleware/authMiddleware");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authmiddleware, authRoutes);
  
app.get("/api/dashboard", authmiddleware, (req, res) => {
  res.json({ message: "Welcome to the dashboard!" });
});
app.get("/", (req, res) => {
  res.send("Sports Firm API Running ");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});