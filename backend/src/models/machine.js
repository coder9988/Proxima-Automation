import mongoose from "mongoose";

const machineSchema = new mongoose.Schema({
  // BASIC INFO
  name: { type: String, required: true },
  type: { type: String },
  status: {
    type: String,
    enum: ["Offline", "Idle", "Running", "Warning", "Critical", "Maintenance"],
    default: "Offline",
  },
  location: { type: String },
  manufacturer: { type: String },
  model: { type: String },
  ratedCurrent: { type: Number },
  installedDate: { type: Date },
  lastMaintenance: { type: Date },
  createdByUser: { type: Boolean, default: false },
  imageURL: { type: String },
  createdAt: { type: Date, default: Date.now },

  // LIVE METRICS (SMOOTH STARTING VALUES)
  temperature: { type: Number, default: 60 },
  vibration: { type: Number, default: 5 },
  current: { type: Number, default: 20 },
  voltage: { type: Number, default: 230 },
  rpm: { type: Number, default: 1200 },
  load: { type: Number, default: 40 },
  pressure: { type: Number, default: 5 },
  humidity: { type: Number, default: 40 },
  power: { type: Number, default: 10 },
  runtimeSeconds: { type: Number, default: 0 },
});

export default mongoose.model("Machine", machineSchema);
