import mongoose from "mongoose";

const metricHistorySchema = new mongoose.Schema({
  machineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Machine", 
    required: true,
    index: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  temperature: { type: Number },
  vibration: { type: Number },
  current: { type: Number },
  voltage: { type: Number },
  rpm: { type: Number },
  load: { type: Number },
  pressure: { type: Number },
  humidity: { type: Number },
  power: { type: Number },
  runtimeSeconds: { type: Number },
});

// Compound index for efficient queries
metricHistorySchema.index({ machineId: 1, timestamp: -1 });

// TTL index to auto-delete old records (keep 30 days)
metricHistorySchema.index({ timestamp: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export default mongoose.model("MetricHistory", metricHistorySchema);
