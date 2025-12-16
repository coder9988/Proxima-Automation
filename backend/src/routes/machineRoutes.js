import express from "express";
import Machine from "../models/machine.js";

const router = express.Router();

// GET all machines
router.get("/", async (req, res) => {
  const machines = await Machine.find();
  res.json(machines);
});

// GET metrics
router.get("/:id/metrics", async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }

    res.json({
      temperature: machine.temperature,
      vibration: machine.vibration,
      current: machine.current,
      voltage: machine.voltage,
      rpm: machine.rpm,
      load: machine.load,
      pressure: machine.pressure,
      humidity: machine.humidity,
      power: machine.power,
      runtimeSeconds: machine.runtimeSeconds,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE machine
router.post("/", async (req, res) => {
  const machine = new Machine(req.body);
  await machine.save();
  res.json(machine);
});

// UPDATE machine
router.put("/:id", async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE machine
router.delete("/:id", async (req, res) => {
  try {
    const machine = await Machine.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }
    res.json({ message: "Machine deleted successfully", id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single machine
router.get("/:id", async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ error: "Machine not found" });
    }
    res.json(machine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
