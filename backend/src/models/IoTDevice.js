import mongoose from "mongoose";

const iotDeviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deviceId: { type: String, required: true, unique: true },
  machineId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Machine"
  },
  
  // Connection settings
  protocol: { 
    type: String, 
    enum: ["MQTT", "OPC-UA", "Modbus", "HTTP"],
    default: "MQTT"
  },
  
  // MQTT settings
  mqttBroker: { type: String },
  mqttTopic: { type: String },
  mqttUsername: { type: String },
  mqttPassword: { type: String },
  
  // OPC-UA settings
  opcuaEndpoint: { type: String },
  opcuaNodeId: { type: String },
  
  // Modbus settings
  modbusHost: { type: String },
  modbusPort: { type: Number },
  modbusUnitId: { type: Number },
  modbusRegisters: [{
    name: { type: String },
    address: { type: Number },
    type: { type: String, enum: ["holding", "input", "coil", "discrete"] },
    dataType: { type: String, enum: ["int16", "uint16", "int32", "uint32", "float32"] },
    scale: { type: Number, default: 1 },
    offset: { type: Number, default: 0 },
  }],
  
  // Data mapping
  dataMapping: {
    temperature: { type: String },
    vibration: { type: String },
    current: { type: String },
    voltage: { type: String },
    rpm: { type: String },
    load: { type: String },
    pressure: { type: String },
    humidity: { type: String },
    power: { type: String },
  },
  
  // Status
  status: { 
    type: String, 
    enum: ["Connected", "Disconnected", "Error", "Pending"],
    default: "Pending"
  },
  lastSeen: { type: Date },
  lastError: { type: String },
  
  // Polling interval in milliseconds
  pollingInterval: { type: Number, default: 1000 },
  
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("IoTDevice", iotDeviceSchema);
