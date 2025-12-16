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
  AreaChart,
  Area,
} from "recharts";

const API_URL = "http://localhost:5000/api/machines";

/* ------------------------------------------------------------
   MODE SELECTION SCREEN
------------------------------------------------------------ */
function ModeSelection({ setScreen }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center text-white pt-16">
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Machine Monitoring System
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Machine <span className="text-green-500">Fault Detection</span>
        </h1>
        <p className="text-gray-400 text-lg mb-12 max-w-xl mx-auto">
          Choose your monitoring mode to get started with real-time machine diagnostics
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div
            onClick={() => setScreen("machineSelection")}
            className="group cursor-pointer p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-green-500/20 transition-colors mx-auto">
              📊
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Online Based</h2>
            <p className="text-gray-400">
              Use simulated machine data with real-time dashboards & analytics
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-green-500 font-semibold">
              Get Started
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          <div className="group cursor-pointer p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-500/20 transition-colors mx-auto">
              📡
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">IoT / Hardware</h2>
            <p className="text-gray-400">
              Connect real sensors & PLC devices via MQTT / OPC UA protocols
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-blue-500 font-semibold">
              Coming Soon
              <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-xs rounded-full">Beta</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   ADD/EDIT MACHINE FORM
------------------------------------------------------------ */
function MachineForm({ setScreen, setRefresh, editMachine = null }) {
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!editMachine;

  const [form, setForm] = useState({
    name: editMachine?.name || "",
    type: editMachine?.type || "",
    status: editMachine?.status || "Offline",
    location: editMachine?.location || "",
    manufacturer: editMachine?.manufacturer || "",
    model: editMachine?.model || "",
    ratedCurrent: editMachine?.ratedCurrent || "",
    installedDate: editMachine?.installedDate?.slice(0, 10) || "",
    lastMaintenance: editMachine?.lastMaintenance?.slice(0, 10) || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isEdit ? `${API_URL}/${editMachine._id}` : API_URL;
    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    setShowToast(true);
    setRefresh((prev) => !prev);

    setTimeout(() => {
      setShowToast(false);
      setScreen("machineSelection");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-24 px-4">
      <div className="w-full max-w-lg">
        <button
          onClick={() => setScreen("machineSelection")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Machines
        </button>

        <h1 className="text-3xl font-bold mb-2">
          {isEdit ? "Edit Machine" : "Add New Machine"}
        </h1>
        <p className="text-gray-400 mb-8">
          {isEdit ? "Update machine details below" : "Fill in the details to register a new machine"}
        </p>

        {showToast && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-500 px-6 py-3 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Machine {isEdit ? "Updated" : "Added"} Successfully
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Machine Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Type</label>
              <input
                name="type"
                value={form.type}
                onChange={handleChange}
                placeholder="e.g., CNC Machine"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              >
                <option value="Running">Running</option>
                <option value="Warning">Warning</option>
                <option value="Offline">Offline</option>
                <option value="Critical">Critical</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Floor 1, Bay 3"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Manufacturer</label>
              <input
                name="manufacturer"
                value={form.manufacturer}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Model</label>
              <input
                name="model"
                value={form.model}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Rated Current (A)</label>
              <input
                name="ratedCurrent"
                type="number"
                value={form.ratedCurrent}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Installation Date</label>
              <input
                name="installedDate"
                type="date"
                value={form.installedDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Last Maintenance</label>
              <input
                name="lastMaintenance"
                type="date"
                value={form.lastMaintenance}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update Machine" : "Add Machine"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   MACHINE SELECTION SCREEN
------------------------------------------------------------ */
function MachineSelection({ setScreen, setSelectedMachine, refresh, setEditMachine }) {
  const [machines, setMachines] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setMachines(data);
        setLoading(false);
      });
  }, [refresh]);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setMachines(machines.filter((m) => m._id !== id));
    setDeleteModal(null);
  };

  const statusStyles = {
    Running: "bg-green-500/10 text-green-500 border-green-500/30",
    Warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    Offline: "bg-gray-500/10 text-gray-400 border-gray-500/30",
    Critical: "bg-red-500/10 text-red-500 border-red-500/30",
    Maintenance: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  };

  const statusDot = {
    Running: "bg-green-500",
    Warning: "bg-yellow-500",
    Offline: "bg-gray-500",
    Critical: "bg-red-500",
    Maintenance: "bg-blue-500",
  };

  const filteredMachines = machines.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => setScreen("mode")}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-2 transition-colors text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold">Your Machines</h1>
            <p className="text-gray-400 mt-1">Select a machine to view live monitoring dashboard</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search machines..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 px-4 py-2.5 pl-10 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => setScreen("addMachine")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Machine
            </button>
          </div>
        </div>

        {/* Machine Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-700 border-t-green-500 rounded-full animate-spin" />
          </div>
        ) : filteredMachines.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-xl font-semibold mb-2">No machines found</h3>
            <p className="text-gray-400 mb-6">
              {machines.length === 0 ? "Add your first machine to get started" : "Try a different search term"}
            </p>
            {machines.length === 0 && (
              <button
                onClick={() => setScreen("addMachine")}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                Add Machine
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMachines.map((m) => (
              <div
                key={m._id}
                className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-green-500 transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-sm text-gray-500">{m.type || "Industrial Machine"}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[m.status] || statusStyles.Offline}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${statusDot[m.status] || statusDot.Offline}`} />
                      {m.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>📍</span> {m.location || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span>🏭</span> {m.manufacturer || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedMachine(m);
                      setScreen("dashboard");
                    }}
                    className="flex-1 py-2.5 bg-gray-800 text-white text-sm font-medium rounded-xl hover:bg-green-500 transition-colors"
                  >
                    Open Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setEditMachine(m);
                      setScreen("editMachine");
                    }}
                    className="p-2.5 bg-gray-800 text-gray-400 rounded-xl hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteModal(m)}
                    className="p-2.5 bg-gray-800 text-gray-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Machine?</h3>
                <p className="text-gray-400 mb-6">
                  Are you sure you want to delete <span className="text-white font-medium">{deleteModal.name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal._id)}
                    className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   DASHBOARD (LIVE METRICS)
------------------------------------------------------------ */
function Dashboard({ machine, setScreen }) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${API_URL}/${machine._id}/metrics`)
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
            if (updated.length > 30) updated.shift();
            return updated;
          });
        })
        .catch((err) => console.error("Metrics fetch error:", err));
    }, 1000);

    return () => clearInterval(interval);
  }, [machine._id]);

  const runtime = new Date(metrics.runtimeSeconds * 1000).toISOString().substring(11, 19);

  // Alerts
  const alerts = [];
  if (metrics.temperature > 90)
    alerts.push({ type: "Overheating", severity: "Critical", detail: `Temperature at ${metrics.temperature.toFixed(1)} °C`, icon: "🔥" });
  if (metrics.vibration > 12)
    alerts.push({ type: "High Vibration", severity: "High", detail: `Vibration at ${metrics.vibration.toFixed(1)} mm/s`, icon: "📳" });
  if (metrics.current > 65)
    alerts.push({ type: "Overload Current", severity: "High", detail: `Current at ${metrics.current.toFixed(1)} A`, icon: "⚡" });
  if (metrics.voltage < 205 || metrics.voltage > 245)
    alerts.push({ type: "Voltage Deviation", severity: "Medium", detail: `Voltage at ${metrics.voltage.toFixed(1)} V`, icon: "🔌" });

  const overallStatus = alerts.find((a) => a.severity === "Critical")
    ? "Critical"
    : alerts.find((a) => a.severity === "High")
    ? "Warning"
    : "Running";

  const statusColors = {
    Critical: "bg-red-500",
    Warning: "bg-yellow-500",
    Running: "bg-green-500",
  };

  const metricCards = [
    { label: "Temperature", value: metrics.temperature.toFixed(1), unit: "°C", icon: "🌡️", color: metrics.temperature > 90 ? "red" : "green" },
    { label: "Vibration", value: metrics.vibration.toFixed(1), unit: "mm/s", icon: "📳", color: metrics.vibration > 12 ? "red" : "green" },
    { label: "Current", value: metrics.current.toFixed(1), unit: "A", icon: "⚡", color: metrics.current > 65 ? "red" : "green" },
    { label: "Voltage", value: metrics.voltage.toFixed(1), unit: "V", icon: "🔌", color: metrics.voltage < 205 || metrics.voltage > 245 ? "yellow" : "green" },
    { label: "RPM", value: metrics.rpm.toFixed(0), unit: "rpm", icon: "🔄", color: "green" },
    { label: "Load", value: metrics.load.toFixed(0), unit: "%", icon: "📊", color: metrics.load > 90 ? "yellow" : "green" },
    { label: "Pressure", value: metrics.pressure.toFixed(1), unit: "bar", icon: "🔵", color: "green" },
    { label: "Humidity", value: metrics.humidity.toFixed(0), unit: "%", icon: "💧", color: "green" },
    { label: "Power", value: metrics.power.toFixed(1), unit: "kW", icon: "🔋", color: "green" },
    { label: "Runtime", value: runtime, unit: "", icon: "⏱️", color: "blue" },
  ];

  const colorClasses = {
    green: "text-green-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    blue: "text-blue-500",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setScreen("machineSelection")}
              className="p-2 bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <p className="text-sm text-gray-400">Live Dashboard</p>
              <h1 className="text-2xl font-bold">{machine.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl font-semibold text-sm ${statusColors[overallStatus]} text-white flex items-center gap-2`}>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              {overallStatus.toUpperCase()}
            </div>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {metricCards.map((card) => (
            <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{card.label}</span>
                <span className="text-lg">{card.icon}</span>
              </div>
              <div className={`text-2xl font-bold ${colorClasses[card.color]}`}>
                {card.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{card.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts & Info */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Live Trend Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="vibGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="curGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "12px" }}
                    labelStyle={{ color: "#9ca3af" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="temperature" stroke="#ef4444" fill="url(#tempGrad)" name="Temperature (°C)" />
                  <Area type="monotone" dataKey="vibration" stroke="#3b82f6" fill="url(#vibGrad)" name="Vibration (mm/s)" />
                  <Area type="monotone" dataKey="current" stroke="#22c55e" fill="url(#curGrad)" name="Current (A)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Machine Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Machine Details</h3>
            <div className="space-y-4">
              {[
                { label: "Model", value: machine.model || "N/A" },
                { label: "Manufacturer", value: machine.manufacturer || "N/A" },
                { label: "Location", value: machine.location || "N/A" },
                { label: "Rated Current", value: machine.ratedCurrent ? `${machine.ratedCurrent} A` : "N/A" },
                { label: "Installed", value: machine.installedDate?.slice(0, 10) || "N/A" },
                { label: "Last Maintenance", value: machine.lastMaintenance?.slice(0, 10) || "N/A" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Active Faults & Alerts</h3>
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">✅</span>
                No active faults. All systems operational.
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{a.icon}</span>
                      <div>
                        <div className="font-semibold">{a.type}</div>
                        <div className="text-sm text-gray-400">{a.detail}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      a.severity === "Critical" ? "bg-red-500/10 text-red-500" :
                      a.severity === "High" ? "bg-orange-500/10 text-orange-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    }`}>
                      {a.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Predictive Maintenance */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Predictive Maintenance</h3>
            <p className="text-sm text-gray-400 mb-6">Component health estimation based on vibration & temperature analysis.</p>
            
            <div className="space-y-4">
              {[
                { name: "Spindle Bearing", health: Math.max(0, 100 - metrics.vibration * 5), critical: true },
                { name: "Motor Winding", health: Math.max(0, 100 - (metrics.temperature - 60)), critical: false },
                { name: "Drive Belt", health: 78, critical: false },
              ].map((comp) => (
                <div key={comp.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{comp.name}</span>
                    <span className={comp.health < 40 ? "text-red-500" : comp.health < 70 ? "text-yellow-500" : "text-green-500"}>
                      {comp.health.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        comp.health < 40 ? "bg-red-500" : comp.health < 70 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${comp.health}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
   MASTER COMPONENT (SOFTWARE APP)
------------------------------------------------------------ */
export default function Software() {
  const [screen, setScreen] = useState("mode");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [editMachine, setEditMachine] = useState(null);
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      {screen === "mode" && <ModeSelection setScreen={setScreen} />}

      {screen === "machineSelection" && (
        <MachineSelection
          setScreen={setScreen}
          setSelectedMachine={setSelectedMachine}
          setEditMachine={setEditMachine}
          refresh={refresh}
        />
      )}

      {screen === "addMachine" && (
        <MachineForm setScreen={setScreen} setRefresh={setRefresh} />
      )}

      {screen === "editMachine" && editMachine && (
        <MachineForm setScreen={setScreen} setRefresh={setRefresh} editMachine={editMachine} />
      )}

      {screen === "dashboard" && selectedMachine && (
        <Dashboard machine={selectedMachine} setScreen={setScreen} />
      )}
    </>
  );
}
