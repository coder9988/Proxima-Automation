import Machine from "../src/models/machine.js";
import MetricHistory from "../src/models/MetricHistory.js";
import { checkMetricsForAlerts } from "../src/services/notificationService.js";

function randomInRange(prev, min, max, step) {
  const delta = (Math.random() * 2 - 1) * step;
  let next = prev + delta;

  if (next < min) next = min;
  if (next > max) next = max;

  return next;
}

// Counter for historical data saving (save every 10 seconds to reduce DB load)
let tickCounter = 0;
const HISTORY_SAVE_INTERVAL = 10;

export function startMetricSimulator() {
  console.log("🔄 Metric Simulator Started...");
  console.log("📊 Historical data saved every", HISTORY_SAVE_INTERVAL, "seconds");

  setInterval(async () => {
    try {
      const machines = await Machine.find();
      tickCounter++;

      for (const machine of machines) {
        const updatedMetrics = {
          temperature: randomInRange(machine.temperature, 50, 110, 2),
          vibration: randomInRange(machine.vibration, 1, 20, 1),
          current: randomInRange(machine.current, 5, 80, 2),
          voltage: randomInRange(machine.voltage, 200, 250, 1),
          rpm: randomInRange(machine.rpm, 800, 2200, 40),
          load: randomInRange(machine.load, 10, 100, 3),
          pressure: randomInRange(machine.pressure, 1, 16, 0.5),
          humidity: randomInRange(machine.humidity, 20, 80, 2),
          power: randomInRange(machine.power, 5, 40, 1.5),
          runtimeSeconds: machine.runtimeSeconds + 1,
        };

        // Update machine with new metrics
        await Machine.updateOne({ _id: machine._id }, { $set: updatedMetrics });

        // Save to history every HISTORY_SAVE_INTERVAL ticks
        if (tickCounter % HISTORY_SAVE_INTERVAL === 0) {
          await MetricHistory.create({
            machineId: machine._id,
            ...updatedMetrics,
          });
        }

        // Check for alerts (with internal cooldown)
        await checkMetricsForAlerts(machine, updatedMetrics);
      }

      // Log status occasionally
      if (tickCounter % 60 === 0) {
        console.log(`✔ Metrics updated | ${machines.length} machines | ${tickCounter} ticks`);
      }
    } catch (err) {
      console.error("❌ Metric simulator error:", err.message);
    }
  }, 1000);
}
