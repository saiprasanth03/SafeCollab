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

/* ======================================================
   ✅ CORS CONFIGURATION (CRITICAL – DO NOT CHANGE ORDER)
====================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:4174",

  // Vercel production + preview domains
  "https://safe-collab.vercel.app",
  "https://safe-collab-gsgti7dl-sai-prasanths-projects-c87af80.vercel.app",
  "https://safe-collab-gwlksuog8-sai-prasanths-projects-c87af80.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, server-to-server, Render health checks
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed for this origin"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-group-id",
    ],
  })
);

/* 🔥 PREFLIGHT HANDLER — REQUIRED FOR BROWSER */
app.options("*", cors());

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json());

/* ======================================================
   ROUTES
====================================================== */
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/group", groupRoutes);

/* ======================================================
   HEALTH CHECK
====================================================== */
app.get("/", (req, res) => {
  res.send("🚀 SafeCollab Backend Running");
});

/* ======================================================
   START SERVER
====================================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
