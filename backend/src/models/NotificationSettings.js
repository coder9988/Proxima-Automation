import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    unique: true
  },
  // Email settings
  emailEnabled: { type: Boolean, default: true },
  emailAddress: { type: String },
  
  // Alert thresholds
  thresholds: {
    temperature: { type: Number, default: 90 },
    vibration: { type: Number, default: 12 },
    current: { type: Number, default: 65 },
    voltageMin: { type: Number, default: 205 },
    voltageMax: { type: Number, default: 245 },
    pressure: { type: Number, default: 8 },
    humidity: { type: Number, default: 80 },
  },
  
  // Notification frequency
  cooldownMinutes: { type: Number, default: 15 }, // Don't send same alert within this time
  dailyDigest: { type: Boolean, default: false },
  digestTime: { type: String, default: "08:00" },
  
  // Severity filter
  minSeverity: { 
    type: String, 
    enum: ["Low", "Medium", "High", "Critical"],
    default: "High"
  },
  
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("NotificationSettings", notificationSettingsSchema);
