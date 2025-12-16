import express from "express";
import MetricHistory from "../models/MetricHistory.js";
import Machine from "../models/machine.js";

const router = express.Router();

// Get historical metrics for a machine
router.get("/:machineId", async (req, res) => {
  try {
    const { machineId } = req.params;
    const { hours = 24, interval = "minute" } = req.query;

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    let aggregation = [];
    
    if (interval === "minute") {
      aggregation = [
        { $match: { machineId: new Object(machineId), timestamp: { $gte: startTime } } },
        { $sort: { timestamp: -1 } },
        { $limit: 1440 }, // Max 24 hours of minute data
      ];
    } else if (interval === "hour") {
      aggregation = [
        { $match: { machineId: new Object(machineId), timestamp: { $gte: startTime } } },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
              hour: { $hour: "$timestamp" },
            },
            timestamp: { $first: "$timestamp" },
            temperature: { $avg: "$temperature" },
            vibration: { $avg: "$vibration" },
            current: { $avg: "$current" },
            voltage: { $avg: "$voltage" },
            rpm: { $avg: "$rpm" },
            load: { $avg: "$load" },
            pressure: { $avg: "$pressure" },
            humidity: { $avg: "$humidity" },
            power: { $avg: "$power" },
          },
        },
        { $sort: { timestamp: -1 } },
      ];
    } else if (interval === "day") {
      aggregation = [
        { $match: { machineId: new Object(machineId), timestamp: { $gte: startTime } } },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
            },
            timestamp: { $first: "$timestamp" },
            temperature: { $avg: "$temperature" },
            vibration: { $avg: "$vibration" },
            current: { $avg: "$current" },
            voltage: { $avg: "$voltage" },
            rpm: { $avg: "$rpm" },
            load: { $avg: "$load" },
            pressure: { $avg: "$pressure" },
            humidity: { $avg: "$humidity" },
            power: { $avg: "$power" },
            maxTemperature: { $max: "$temperature" },
            minTemperature: { $min: "$temperature" },
            maxVibration: { $max: "$vibration" },
            maxCurrent: { $max: "$current" },
          },
        },
        { $sort: { timestamp: -1 } },
      ];
    }

    const history = await MetricHistory.aggregate(aggregation);
    res.json(history.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get analytics summary for a machine
router.get("/:machineId/analytics", async (req, res) => {
  try {
    const { machineId } = req.params;
    const { hours = 24 } = req.query;

    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const analytics = await MetricHistory.aggregate([
      { $match: { machineId: new Object(machineId), timestamp: { $gte: startTime } } },
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
          totalPower: { $sum: "$power" },
          dataPoints: { $sum: 1 },
        },
      },
    ]);

    res.json(analytics[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comparison data for multiple machines
router.post("/compare", async (req, res) => {
  try {
    const { machineIds, hours = 24, metric = "temperature" } = req.body;
    const startTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const results = await Promise.all(
      machineIds.map(async (machineId) => {
        const machine = await Machine.findById(machineId);
        const data = await MetricHistory.aggregate([
          { $match: { machineId: new Object(machineId), timestamp: { $gte: startTime } } },
          {
            $group: {
              _id: { hour: { $hour: "$timestamp" } },
              value: { $avg: `$${metric}` },
              timestamp: { $first: "$timestamp" },
            },
          },
          { $sort: { timestamp: 1 } },
        ]);
        return { machineId, machineName: machine?.name, data };
      })
    );

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record metric history (called by simulator)
router.post("/", async (req, res) => {
  try {
    const record = new MetricHistory(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
