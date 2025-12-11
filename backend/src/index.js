import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import machineRoutes from "./routes/machineRoutes.js";
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
  res.send("Backend running");
});

// Machine API routes
app.use("/api/machines", machineRoutes);

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
