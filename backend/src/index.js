import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import iotRoutes from "./routes/iotRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { startMetricSimulator } from "../simulator/metricSimulator.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to DB
mongoose
  .connect("mongodb://127.0.0.1:27017/machinesdb")
  .then(() => {
    console.log("✅ MongoDB Connected");

    // START SIMULATOR AFTER DB IS CONNECTED
    startMetricSimulator();
  })
  .catch((err) => console.error("❌ MongoDB Error:", err.message));

app.get("/", (req, res) => {
  res.send("Backend running - Proxima Automation API");
});

// API routes
app.use("/api/machines", machineRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/iot", iotRoutes);
app.use("/api/notifications", notificationRoutes);

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
  console.log("📡 API Endpoints:");
  console.log("   - /api/machines       - Machine CRUD");
  console.log("   - /api/history        - Historical metrics");
  console.log("   - /api/alerts         - Alert logs");
  console.log("   - /api/auth           - Authentication");
  console.log("   - /api/export         - Data export");
  console.log("   - /api/iot            - IoT devices");
  console.log("   - /api/notifications  - Email notifications");
});
