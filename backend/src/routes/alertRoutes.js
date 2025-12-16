import express from "express";
import AlertLog from "../models/AlertLog.js";
import Machine from "../models/machine.js";

const router = express.Router();

// Get all alerts with filters
router.get("/", async (req, res) => {
  try {
    const { 
      machineId, 
      severity, 
      status, 
      startDate, 
      endDate,
      limit = 100,
      page = 1 
    } = req.query;

    const filter = {};
    
    if (machineId) filter.machineId = machineId;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [alerts, total] = await Promise.all([
      AlertLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("machineId", "name type location"),
      AlertLog.countDocuments(filter),
    ]);

    res.json({
      alerts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get alerts for a specific machine
router.get("/machine/:machineId", async (req, res) => {
  try {
    const { machineId } = req.params;
    const { limit = 50 } = req.query;

    const alerts = await AlertLog.find({ machineId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get alert statistics
router.get("/stats", async (req, res) => {
  try {
    const { hours = 24 } = req.query;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const stats = await AlertLog.aggregate([
      { $match: { createdAt: { $gte: startTime } } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          critical: { $sum: { $cond: [{ $eq: ["$severity", "Critical"] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ["$severity", "High"] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ["$severity", "Medium"] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ["$severity", "Low"] }, 1, 0] } },
          active: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          acknowledged: { $sum: { $cond: [{ $eq: ["$status", "Acknowledged"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
        },
      },
    ]);

    // Get alerts by type
    const byType = await AlertLog.aggregate([
      { $match: { createdAt: { $gte: startTime } } },
      { $group: { _id: "$alertType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get alerts by machine
    const byMachine = await AlertLog.aggregate([
      { $match: { createdAt: { $gte: startTime } } },
      { $group: { _id: "$machineId", machineName: { $first: "$machineName" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      summary: stats[0] || { total: 0, critical: 0, high: 0, medium: 0, low: 0, active: 0, acknowledged: 0, resolved: 0 },
      byType,
      byMachine,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new alert
router.post("/", async (req, res) => {
  try {
    const alert = new AlertLog(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Acknowledge an alert
router.patch("/:id/acknowledge", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const alert = await AlertLog.findByIdAndUpdate(
      id,
      { 
        status: "Acknowledged", 
        acknowledgedBy: userId,
        acknowledgedAt: new Date() 
      },
      { new: true }
    );

    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Resolve an alert
router.patch("/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await AlertLog.findByIdAndUpdate(
      id,
      { status: "Resolved", resolvedAt: new Date() },
      { new: true }
    );

    if (!alert) return res.status(404).json({ error: "Alert not found" });
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete old resolved alerts
router.delete("/cleanup", async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const result = await AlertLog.deleteMany({
      status: "Resolved",
      resolvedAt: { $lt: cutoff },
    });

    res.json({ deleted: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
