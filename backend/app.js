const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const configuredOrigins = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN;
if (process.env.NODE_ENV === "production" && !configuredOrigins) {
  throw new Error("FRONTEND_ORIGINS must be set in production");
}

const allowedOrigins = (configuredOrigins || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && allowedOrigins.some((origin) => !/^https:\/\//i.test(origin))) {
  throw new Error("Production frontend origins must use HTTPS");
}

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
};

// ===============================
// Middleware
// ===============================
app.use(cors(corsOptions));
app.use(express.json({ limit: "100kb" }));

// ===============================
// Database Connection
// ===============================
if (!process.env.MONGO_URI) {
  throw new Error('MONGO_URI environment variable is not set');
}
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ===============================
// API Routes
// ===============================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Oral Health App backend is running 🚀" });
});

// ===============================
// Serve Frontend in Production
// ===============================
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // React Router catch-all (safe for Node 22)
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.join(frontendPath, "index.html"));
    }
    next();
  });
}

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
