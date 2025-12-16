import express from "express";
import IoTDevice from "../models/IoTDevice.js";
import Machine from "../models/machine.js";

const router = express.Router();

// Store active connections (in production, use Redis or similar)
const activeConnections = new Map();

// Get all IoT devices
router.get("/", async (req, res) => {
  try {
    const devices = await IoTDevice.find()
      .populate("machineId", "name type status")
      .sort({ createdAt: -1 });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single device
router.get("/:id", async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id)
      .populate("machineId", "name type status location");
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new IoT device
router.post("/", async (req, res) => {
  try {
    const device = new IoTDevice(req.body);
    await device.save();
    res.status(201).json(device);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update device
router.put("/:id", async (req, res) => {
  try {
    const device = await IoTDevice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!device) return res.status(404).json({ error: "Device not found" });
    res.json(device);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete device
router.delete("/:id", async (req, res) => {
  try {
    const device = await IoTDevice.findByIdAndDelete(req.params.id);
    if (!device) return res.status(404).json({ error: "Device not found" });
    
    // Disconnect if connected
    if (activeConnections.has(req.params.id)) {
      activeConnections.get(req.params.id).disconnect?.();
      activeConnections.delete(req.params.id);
    }
    
    res.json({ message: "Device deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test connection
router.post("/:id/test", async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ error: "Device not found" });

    // Simulate connection test based on protocol
    let testResult = { success: false, message: "" };

    switch (device.protocol) {
      case "MQTT":
        testResult = {
          success: true,
          message: `MQTT connection test to ${device.mqttBroker} successful`,
          latency: Math.floor(Math.random() * 50) + 10,
        };
        break;
      case "OPC-UA":
        testResult = {
          success: true,
          message: `OPC-UA connection to ${device.opcuaEndpoint} successful`,
          latency: Math.floor(Math.random() * 100) + 20,
        };
        break;
      case "Modbus":
        testResult = {
          success: true,
          message: `Modbus TCP connection to ${device.modbusHost}:${device.modbusPort} successful`,
          latency: Math.floor(Math.random() * 30) + 5,
        };
        break;
      default:
        testResult = {
          success: false,
          message: "Unknown protocol",
        };
    }

    // Update device status
    await IoTDevice.findByIdAndUpdate(device._id, {
      status: testResult.success ? "Connected" : "Error",
      lastSeen: testResult.success ? new Date() : undefined,
      lastError: testResult.success ? null : testResult.message,
    });

    res.json(testResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start data collection
router.post("/:id/start", async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ error: "Device not found" });

    if (activeConnections.has(req.params.id)) {
      return res.status(400).json({ error: "Device already running" });
    }

    // Simulate starting data collection
    const interval = setInterval(async () => {
      // Generate simulated data based on mapping
      const data = {
        temperature: 60 + Math.random() * 30,
        vibration: 3 + Math.random() * 8,
        current: 15 + Math.random() * 40,
        voltage: 220 + Math.random() * 20,
        rpm: 1000 + Math.random() * 500,
        load: 30 + Math.random() * 50,
        pressure: 4 + Math.random() * 4,
        humidity: 30 + Math.random() * 40,
        power: 5 + Math.random() * 15,
      };

      // Update linked machine if exists
      if (device.machineId) {
        await Machine.findByIdAndUpdate(device.machineId, data);
      }

      // Update last seen
      await IoTDevice.findByIdAndUpdate(device._id, {
        status: "Connected",
        lastSeen: new Date(),
      });
    }, device.pollingInterval || 1000);

    activeConnections.set(req.params.id, { interval, disconnect: () => clearInterval(interval) });

    await IoTDevice.findByIdAndUpdate(device._id, { status: "Connected" });

    res.json({ message: "Data collection started", deviceId: device._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stop data collection
router.post("/:id/stop", async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ error: "Device not found" });

    if (activeConnections.has(req.params.id)) {
      activeConnections.get(req.params.id).disconnect();
      activeConnections.delete(req.params.id);
    }

    await IoTDevice.findByIdAndUpdate(device._id, { status: "Disconnected" });

    res.json({ message: "Data collection stopped" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get connection status
router.get("/:id/status", async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);
    if (!device) return res.status(404).json({ error: "Device not found" });

    res.json({
      deviceId: device._id,
      status: device.status,
      isRunning: activeConnections.has(req.params.id),
      lastSeen: device.lastSeen,
      lastError: device.lastError,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Receive data from external IoT device (webhook)
router.post("/webhook/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;
    const data = req.body;

    const device = await IoTDevice.findOne({ deviceId });
    if (!device) return res.status(404).json({ error: "Device not found" });

    // Map incoming data to machine metrics
    const mappedData = {};
    const mapping = device.dataMapping;

    if (mapping.temperature && data[mapping.temperature] !== undefined) {
      mappedData.temperature = parseFloat(data[mapping.temperature]);
    }
    if (mapping.vibration && data[mapping.vibration] !== undefined) {
      mappedData.vibration = parseFloat(data[mapping.vibration]);
    }
    if (mapping.current && data[mapping.current] !== undefined) {
      mappedData.current = parseFloat(data[mapping.current]);
    }
    if (mapping.voltage && data[mapping.voltage] !== undefined) {
      mappedData.voltage = parseFloat(data[mapping.voltage]);
    }
    if (mapping.rpm && data[mapping.rpm] !== undefined) {
      mappedData.rpm = parseFloat(data[mapping.rpm]);
    }
    if (mapping.load && data[mapping.load] !== undefined) {
      mappedData.load = parseFloat(data[mapping.load]);
    }
    if (mapping.pressure && data[mapping.pressure] !== undefined) {
      mappedData.pressure = parseFloat(data[mapping.pressure]);
    }
    if (mapping.humidity && data[mapping.humidity] !== undefined) {
      mappedData.humidity = parseFloat(data[mapping.humidity]);
    }
    if (mapping.power && data[mapping.power] !== undefined) {
      mappedData.power = parseFloat(data[mapping.power]);
    }

    // Update machine
    if (device.machineId && Object.keys(mappedData).length > 0) {
      await Machine.findByIdAndUpdate(device.machineId, mappedData);
    }

    // Update device status
    await IoTDevice.findByIdAndUpdate(device._id, {
      status: "Connected",
      lastSeen: new Date(),
    });

    res.json({ message: "Data received", mappedFields: Object.keys(mappedData) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
