import express from "express";
import Machine from "../models/machine.js";
import MetricHistory from "../models/MetricHistory.js";
import AlertLog from "../models/AlertLog.js";

const router = express.Router();

// Export machine metrics to CSV
router.get("/csv/:machineId", async (req, res) => {
  try {
    const { machineId } = req.params;
    const { hours = 24 } = req.query;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    const history = await MetricHistory.find({
      machineId,
      timestamp: { $gte: startTime },
    }).sort({ timestamp: -1 });

    // Generate CSV
    const headers = [
      "Timestamp",
      "Temperature (°C)",
      "Vibration (mm/s)",
      "Current (A)",
      "Voltage (V)",
      "RPM",
      "Load (%)",
      "Pressure (bar)",
      "Humidity (%)",
      "Power (kW)",
      "Runtime (s)",
    ];

    const rows = history.map((h) => [
      h.timestamp.toISOString(),
      h.temperature?.toFixed(2) || "",
      h.vibration?.toFixed(2) || "",
      h.current?.toFixed(2) || "",
      h.voltage?.toFixed(2) || "",
      h.rpm?.toFixed(0) || "",
      h.load?.toFixed(1) || "",
      h.pressure?.toFixed(2) || "",
      h.humidity?.toFixed(1) || "",
      h.power?.toFixed(2) || "",
      h.runtimeSeconds || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${machine.name}_metrics_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export all machines summary to CSV
router.get("/csv/machines/summary", async (req, res) => {
  try {
    const machines = await Machine.find();

    const headers = [
      "Name",
      "Type",
      "Status",
      "Location",
      "Manufacturer",
      "Model",
      "Rated Current (A)",
      "Installed Date",
      "Last Maintenance",
      "Current Temperature (°C)",
      "Current Vibration (mm/s)",
      "Current (A)",
      "Voltage (V)",
      "RPM",
      "Load (%)",
      "Runtime (s)",
    ];

    const rows = machines.map((m) => [
      m.name,
      m.type || "",
      m.status,
      m.location || "",
      m.manufacturer || "",
      m.model || "",
      m.ratedCurrent || "",
      m.installedDate?.toISOString().slice(0, 10) || "",
      m.lastMaintenance?.toISOString().slice(0, 10) || "",
      m.temperature?.toFixed(2) || "",
      m.vibration?.toFixed(2) || "",
      m.current?.toFixed(2) || "",
      m.voltage?.toFixed(2) || "",
      m.rpm?.toFixed(0) || "",
      m.load?.toFixed(1) || "",
      m.runtimeSeconds || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="machines_summary_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export alerts to CSV
router.get("/csv/alerts", async (req, res) => {
  try {
    const { machineId, days = 7 } = req.query;
    const startTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const filter = { createdAt: { $gte: startTime } };
    if (machineId) filter.machineId = machineId;

    const alerts = await AlertLog.find(filter)
      .sort({ createdAt: -1 })
      .populate("machineId", "name");

    const headers = [
      "Timestamp",
      "Machine",
      "Alert Type",
      "Severity",
      "Message",
      "Value",
      "Threshold",
      "Unit",
      "Status",
      "Acknowledged At",
      "Resolved At",
    ];

    const rows = alerts.map((a) => [
      a.createdAt.toISOString(),
      a.machineName || a.machineId?.name || "",
      a.alertType,
      a.severity,
      `"${a.message || ""}"`,
      a.value || "",
      a.threshold || "",
      a.unit || "",
      a.status,
      a.acknowledgedAt?.toISOString() || "",
      a.resolvedAt?.toISOString() || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="alerts_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate PDF report (returns JSON data for client-side PDF generation)
router.get("/report/:machineId", async (req, res) => {
  try {
    const { machineId } = req.params;
    const { hours = 24 } = req.query;

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    // Get analytics
    const analytics = await MetricHistory.aggregate([
      { $match: { machineId: machine._id, timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: null,
          avgTemperature: { $avg: "$temperature" },
          maxTemperature: { $max: "$temperature" },
          minTemperature: { $min: "$temperature" },
          avgVibration: { $avg: "$vibration" },
          maxVibration: { $max: "$vibration" },
          avgCurrent: { $avg: "$current" },
          maxCurrent: { $max: "$current" },
          avgVoltage: { $avg: "$voltage" },
          avgRpm: { $avg: "$rpm" },
          avgLoad: { $avg: "$load" },
          avgPower: { $avg: "$power" },
          totalPowerKwh: { $sum: { $divide: ["$power", 3600] } },
          dataPoints: { $sum: 1 },
        },
      },
    ]);

    // Get alerts in period
    const alerts = await AlertLog.find({
      machineId,
      createdAt: { $gte: startTime },
    }).sort({ createdAt: -1 });

    // Get hourly data for charts
    const hourlyData = await MetricHistory.aggregate([
      { $match: { machineId: machine._id, timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: { hour: { $hour: "$timestamp" }, day: { $dayOfMonth: "$timestamp" } },
          timestamp: { $first: "$timestamp" },
          temperature: { $avg: "$temperature" },
          vibration: { $avg: "$vibration" },
          current: { $avg: "$current" },
          power: { $avg: "$power" },
        },
      },
      { $sort: { timestamp: 1 } },
    ]);

    res.json({
      machine: {
        name: machine.name,
        type: machine.type,
        status: machine.status,
        location: machine.location,
        manufacturer: machine.manufacturer,
        model: machine.model,
        installedDate: machine.installedDate,
        lastMaintenance: machine.lastMaintenance,
      },
      period: {
        start: startTime,
        end: new Date(),
        hours,
      },
      analytics: analytics[0] || {},
      alerts: {
        total: alerts.length,
        critical: alerts.filter((a) => a.severity === "Critical").length,
        high: alerts.filter((a) => a.severity === "High").length,
        list: alerts.slice(0, 20),
      },
      hourlyData,
      generatedAt: new Date(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
