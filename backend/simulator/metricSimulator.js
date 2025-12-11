import Machine from ".src/models/Machine.js";

function randomInRange(prev, min, max, step) {
  const delta = (Math.random() * 2 - 1) * step;
  let next = prev + delta;

  if (next < min) next = min;
  if (next > max) next = max;

  return next;
}

export function startMetricSimulator() {
  console.log("🔄 Metric Simulator Started...");

  setInterval(async () => {
    try {
      const machines = await Machine.find();

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

        await Machine.updateOne({ _id: machine._id }, { $set: updatedMetrics });
      }

      console.log("✔ Metrics updated");
    } catch (err) {
      console.error("❌ Metric simulator error:", err.message);
    }
  }, 1000);
}
