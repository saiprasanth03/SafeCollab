import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import dataRoutes from "./routes/dataRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";

dotenv.config();
connectDB();

const app = express();

/* =========================
   ✅ CORS (MUST BE FIRST)
   ========================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://safecollab.vercel.app", // add later after frontend deploy
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-group-id"],
  })
);

// VERY IMPORTANT: handle preflight
app.options("*", cors());

/* =========================
   ✅ BODY PARSER
   ========================= */
app.use(express.json());

/* =========================
   ✅ ROUTES
   ========================= */
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/group", groupRoutes);

/* =========================
   ✅ TEST ROUTE
   ========================= */
app.get("/", (req, res) => {
  res.send("🚀 SafeCollab Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
