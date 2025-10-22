import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import route from "../routes/index.js";

const app = express();

/**
 * ---------------------------------------
 * Global Middleware Configuration
 * ---------------------------------------
 */

// Security headers (protect against common web vulnerabilities)
app.use(helmet());

// Gzip compression for better performance
app.use(compression());

// HTTP request logging (use 'combined' in production)
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(morgan(morganFormat));

// Enable CORS with safe and flexible configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true, // allow specific origin via .env
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  })
);

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Register main routes
app.use("/api", route);

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", environment: process.env.NODE_ENV });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

export default app;
