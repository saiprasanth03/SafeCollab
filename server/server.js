import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();

// Connect DB
connectDB();

// Initialize app ✅ (THIS WAS MISSING / MISPLACED)
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/group", groupRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("🚀 SafeCollab Backend Running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
