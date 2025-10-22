import express from "express";
import "dotenv/config";
import appMiddleware from "./middleware/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * ---------------------------------------
 * Mount Global Middleware & Routes
 * ---------------------------------------
 */
app.use(appMiddleware);

/**
 * ---------------------------------------
 * Start Express Server
 * ---------------------------------------
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

/**
 * ---------------------------------------
 * Graceful Shutdown Handling
 * ---------------------------------------
 */
const gracefulShutdown = async (signal) => {
  console.log(`\n🧹 Received ${signal}. Closing server gracefully...`);
  server.close(() => {
    console.log("✅ HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT")); // Ctrl+C
process.on("SIGTERM", () => gracefulShutdown("SIGTERM")); // Docker/K8s stop

/**
 * ---------------------------------------
 * Global Unhandled Error Handling
 * ---------------------------------------
 */
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});
