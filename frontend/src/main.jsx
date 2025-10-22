import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// ✅ Axios global configuration
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
axios.defaults.timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

// ✅ Optional: log base URL during development
if (import.meta.env.DEV) {
  console.info("[Axios Config] Base URL:", axios.defaults.baseURL);
  console.info("[Axios Config] Timeout:", axios.defaults.timeout);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
