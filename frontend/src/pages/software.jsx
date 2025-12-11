import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------
   MODE SELECTION SCREEN
------------------------------------------------------------ */
function ModeSelection({ setScreen }) {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl font-bold mb-10">Machine Fault Detection</h1>
      <p className="text-lg mb-10">
        Choose how you want to monitor your machines
      </p>

      <div className="flex gap-10">
        <div
          onClick={() => setScreen("machineSelection")}
          className="cursor-pointer px-10 py-8 rounded-2xl bg-green-700 hover:bg-green-600 transition transform hover:scale-105 w-80 text-center"
        >
          <h2 className="text-2xl font-semibold">Online Based</h2>
          <p className="mt-3 text-sm opacity-90">
            Use simulated machine data with dashboards & analytics
          </p>
        </div>

        <div className="cursor-pointer px-10 py-8 rounded-2xl bg-blue-700 hover:bg-blue-600 transition transform hover:scale-105 w-80 text-center">
          <h2 className="text-2xl font-semibold">IoT / Hardware</h2>
          <p className="mt-3 text-sm opacity-90">
            Connect real sensors & PLC devices via MQTT / OPC UA
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   ADD MACHINE FORM
------------------------------------------------------------ */
function AddMachine({ setScreen, setRefresh }) {
  const [showToast, setShowToast] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "",
    status: "Offline",
    location: "",
    manufacturer: "",
    model: "",
    ratedCurrent: "",
    installedDate: "",
    lastMaintenance: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/machines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setShowToast(true);
    setRefresh((prev) => !prev);

    setTimeout(() => {
      setShowToast(false);
      setScreen("machineSelection");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Machine</h1>

      {showToast && (
        <div className="mb-6 bg-green-600 px-6 py-3 rounded-xl text-center font-semibold shadow-lg">
          ✔ Machine Added Successfully
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-2xl w-96 flex flex-col gap-4 border border-gray-700"
      >
        <input
          name="name"
          placeholder="Machine Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
          required
        />

        <input
          name="type"
          placeholder="Machine Type"
          value={form.type}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        >
          <option>Running</option>
          <option>Warning</option>
          <option>Offline</option>
          <option>Critical</option>
        </select>

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <input
          name="manufacturer"
          placeholder="Manufacturer"
          value={form.manufacturer}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <input
          name="model"
          placeholder="Model Number"
          value={form.model}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <input
          name="ratedCurrent"
          type="number"
          placeholder="Rated Current (A)"
          value={form.ratedCurrent}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <label className="text-xs opacity-60">Installation Date</label>
        <input
          name="installedDate"
          type="date"
          value={form.installedDate}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <label className="text-xs opacity-60">Last Maintenance</label>
        <input
          name="lastMaintenance"
          type="date"
          value={form.lastMaintenance}
          onChange={handleChange}
          className="p-2 rounded-lg bg-gray-700 focus:outline-none"
        />

        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-500 py-2 rounded-lg font-semibold"
        >
          Save Machine
        </button>
      </form>

      <button
        className="mt-6 bg-gray-700 px-4 py-2 rounded-lg text-sm"
        onClick={() => setScreen("machineSelection")}
      >
        ← Back
      </button>
    </div>
  );
}

/* ------------------------------------------------------------
   MACHINE SELECTION SCREEN
------------------------------------------------------------ */
function MachineSelection({ setScreen, setSelectedMachine, refresh }) {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/machines")
      .then((res) => res.json())
      .then((data) => setMachines(data));
  }, [refresh]);

  const statusColor = {
    Running: "bg-green-500",
    Warning: "bg-yellow-500",
    Offline: "bg-gray-500",
    Critical: "bg-red-600",
  };

  const filteredMachines = machines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-6 mb-6">
        <h1 className="text-3xl font-bold mb-2 md:mb-0">
          Select a Machine to Monitor
        </h1>

        <input
          type="text"
          placeholder="🔍 Search machine..."
          className="p-2 rounded-xl bg-gray-800 border border-gray-700 w-72 focus:outline-none focus:ring-2 focus:ring-green-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <p className="mb-8 text-sm opacity-70">
        Choose a machine to view live readings, charts and fault status
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {filteredMachines.map((m) => (
          <div
            key={m._id}
            onClick={() => {
              setSelectedMachine(m);
              setScreen("dashboard");
            }}
            className="cursor-pointer bg-gray-800 p-6 rounded-2xl w-72 hover:bg-gray-700 transition transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-4">{m.name}</h2>

            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${statusColor[m.status]}`}
              ></div>
              <span className="text-sm">{m.status}</span>
            </div>

            <p className="text-xs opacity-60">Tap to open live control panel</p>
          </div>
        ))}
      </div>

      <button
        className="mt-10 px-6 py-3 bg-green-600 rounded-xl hover:bg-green-500 text-sm"
        onClick={() => setScreen("addMachine")}
      >
        + Add New Machine
      </button>
    </div>
  );
}

/* ------------------------------------------------------------
   DASHBOARD (LIVE METRICS)
------------------------------------------------------------ */
function Dashboard({ machine, setScreen }) {
  const [showPopup, setShowPopup] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  const [metrics, setMetrics] = useState({
    temperature: 0,
    vibration: 0,
    current: 0,
    voltage: 0,
    rpm: 0,
    load: 0,
    pressure: 0,
    humidity: 0,
    power: 0,
    runtimeSeconds: 0,
  });

  const [chartData, setChartData] = useState([]);

  // Fetch live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`http://localhost:5000/api/machines/${machine._id}/metrics`)
        .then((res) => res.json())
        .then((data) => {
          setMetrics(data);

          setChartData((prev) => {
            const entry = {
              time: new Date().toLocaleTimeString().slice(0, 8),
              temperature: data.temperature,
              vibration: data.vibration,
              current: data.current,
            };

            const updated = [...prev, entry];
            if (updated.length > 25) updated.shift();
            return updated;
          });
        })
        .catch((err) => console.error("Metrics fetch error:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [machine._id]);

  // Runtime formatting
  const runtime = new Date(metrics.runtimeSeconds * 1000)
    .toISOString()
    .substring(11, 19);

  // Alerts
  const alerts = [];

  if (metrics.temperature > 90)
    alerts.push({
      type: "Overheating",
      severity: "Critical",
      detail: `Temperature at ${metrics.temperature.toFixed(1)} °C`,
    });

  if (metrics.vibration > 12)
    alerts.push({
      type: "High Vibration",
      severity: "High",
      detail: `Vibration at ${metrics.vibration.toFixed(1)} mm/s`,
    });

  if (metrics.current > 65)
    alerts.push({
      type: "Overload Current",
      severity: "High",
      detail: `Current at ${metrics.current.toFixed(1)} A`,
    });

  if (metrics.voltage < 205 || metrics.voltage > 245)
    alerts.push({
      type: "Voltage Deviation",
      severity: "Medium",
      detail: `Voltage at ${metrics.voltage.toFixed(1)} V`,
    });

  const overallStatus = alerts.find((a) => a.severity === "Critical")
    ? "Critical"
    : alerts.find((a) => a.severity === "High")
    ? "Warning"
    : "Running";

  const statusColor =
    overallStatus === "Critical"
      ? "bg-red-600"
      : overallStatus === "Warning"
      ? "bg-yellow-500"
      : "bg-green-600";

  // Metric Cards
  const metricCards = [
    { label: "Temperature", value: `${metrics.temperature.toFixed(1)} °C` },
    { label: "Vibration", value: `${metrics.vibration.toFixed(1)} mm/s` },
    { label: "Current", value: `${metrics.current.toFixed(1)} A` },
    { label: "Voltage", value: `${metrics.voltage.toFixed(1)} V` },
    { label: "RPM", value: `${metrics.rpm.toFixed(0)} rpm` },
    { label: "Load", value: `${metrics.load.toFixed(0)} %` },
    { label: "Pressure", value: `${metrics.pressure.toFixed(1)} bar` },
    { label: "Humidity", value: `${metrics.humidity.toFixed(0)} %` },
    { label: "Power", value: `${metrics.power.toFixed(1)} kW` },
    { label: "Runtime", value: runtime },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            className="bg-gray-800 px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
            onClick={() => setScreen("machineSelection")}
          >
            ← Back
          </button>
          <div>
            <div className="text-xs opacity-60">Machine Dashboard</div>
            <div className="text-2xl font-bold">{machine.name}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
          >
            {overallStatus.toUpperCase()}
          </div>
          <div className="text-xs opacity-60">Last update: Live</div>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {metricCards.map((card) => (
          <div
            key={card.label}
            className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] opacity-60">{card.label}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-sm md:text-base font-semibold">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* CHART + MACHINE DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-semibold">Live Trend Overview</div>
          </div>
          <div className="h-56 bg-gray-950 rounded-xl p-2 border border-gray-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#ff4f4f"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="vibration"
                  stroke="#00d4ff"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#16ff3a"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MACHINE DETAILS */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="text-sm font-semibold mb-2">Machine Details</div>
          <div className="space-y-1 text-xs opacity-75">
            <div>Model: {machine.model}</div>
            <div>Manufacturer: {machine.manufacturer}</div>
            <div>Location: {machine.location}</div>
            <div>Rated Current: {machine.ratedCurrent} A</div>
            <div>Installed: {String(machine.installedDate).slice(0, 10)}</div>
            <div>
              Last Maintenance: {String(machine.lastMaintenance).slice(0, 10)}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE FAULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="text-sm font-semibold mb-2">
            Active Faults & Alerts
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {alerts.length === 0 && (
              <div className="text-xs opacity-60">No active faults.</div>
            )}

            {alerts.map((a, i) => (
              <div
                key={i}
                className="flex justify-between bg-gray-950 rounded-xl px-3 py-2 border border-gray-800"
              >
                <div>
                  <div className="text-xs font-semibold">{a.type}</div>
                  <div className="text-[11px] opacity-70">{a.detail}</div>
                </div>

                <div
                  className={
                    "px-2 py-1 rounded-full text-[9px] font-semibold " +
                    (a.severity === "Critical"
                      ? "bg-red-600"
                      : a.severity === "High"
                      ? "bg-orange-500"
                      : "bg-yellow-400")
                  }
                >
                  {a.severity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PREDICTIVE MAINTENANCE */}
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="text-sm font-semibold mb-2">
            Predictive Maintenance
          </div>
          <div className="text-xs opacity-80 mb-2">
            Component health estimation based on vibration & temperature.
          </div>

          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span>Spindle Bearing Health</span>
              <span>38%</span>
            </div>
            <div className="w-full bg-gray-800 h-2 rounded-full">
              <div className="h-full w-[38%] bg-red-600"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ALERT POPUP */}
      {showPopup && activeAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 border border-red-600 p-6 rounded-2xl w-96 shadow-xl">
            <div className="text-xl font-bold text-red-500 mb-2">
              ⚠ {activeAlert.type}
            </div>

            <div className="text-sm mb-4 opacity-80">{activeAlert.detail}</div>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
                onClick={() => setShowPopup(false)}
              >
                Acknowledge
              </button>

              <button className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm">
                Emergency Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   MASTER COMPONENT (SOFTWARE APP)
------------------------------------------------------------ */
export default function Software() {
  const [screen, setScreen] = useState("mode");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      {screen === "mode" && <ModeSelection setScreen={setScreen} />}

      {screen === "machineSelection" && (
        <MachineSelection
          setScreen={setScreen}
          setSelectedMachine={setSelectedMachine}
          refresh={refresh}
        />
      )}

      {screen === "addMachine" && (
        <AddMachine setScreen={setScreen} setRefresh={setRefresh} />
      )}

      {screen === "dashboard" && selectedMachine && (
        <Dashboard machine={selectedMachine} setScreen={setScreen} />
      )}
    </>
  );
}
