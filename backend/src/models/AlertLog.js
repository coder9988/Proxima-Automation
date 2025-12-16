import mongoose from "mongoose";

const alertLogSchema = new mongoose.Schema({
  machineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Machine", 
    required: true,
    index: true 
  },
  machineName: { type: String },
  alertType: { 
    type: String, 
    required: true,
    enum: ["Overheating", "High Vibration", "Overload Current", "Voltage Deviation", "Low Pressure", "High Humidity", "System Offline", "Critical Failure"]
  },
  severity: { 
    type: String, 
    required: true,
    enum: ["Low", "Medium", "High", "Critical"]
  },
  message: { type: String },
  value: { type: Number },
  threshold: { type: Number },
  unit: { type: String },
  status: {
    type: String,
    enum: ["Active", "Acknowledged", "Resolved"],
    default: "Active"
  },
  acknowledgedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  acknowledgedAt: { type: Date },
  resolvedAt: { type: Date },
  notificationSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

// Index for querying recent alerts
alertLogSchema.index({ createdAt: -1 });
alertLogSchema.index({ machineId: 1, createdAt: -1 });

export default mongoose.model("AlertLog", alertLogSchema);
