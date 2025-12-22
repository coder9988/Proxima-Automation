import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000/api";

// Add Machine Modal Component
function AddMachineModal({ isOpen, onClose, onAdd, token }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "CNC Machine",
    location: "",
    manufacturer: "",
    model: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/machines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newMachine = await res.json();
        onAdd(newMachine);
        setFormData({ name: "", type: "CNC Machine", location: "", manufacturer: "", model: "" });
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to add machine");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">➕</span> Add New Machine
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Machine Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="e.g., CNC Mill #1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Machine Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500"
            >
              <option>CNC Machine</option>
              <option>Assembly Robot</option>
              <option>Packaging Line</option>
              <option>Conveyor System</option>
              <option>Press Machine</option>
              <option>Welding Robot</option>
              <option>3D Printer</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="e.g., Building A, Floor 2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Manufacturer</label>
              <input
                type="text"
                value={formData.manufacturer}
                onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="e.g., Siemens"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="e.g., S7-1500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 text-gray-300 font-medium rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Machine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Alerts Modal Component
function AlertsModal({ isOpen, onClose, alerts, token, onAcknowledge }) {
  if (!isOpen) return null;

  const handleAcknowledge = async (alertId) => {
    try {
      const res = await fetch(`${API_URL}/alerts/${alertId}/acknowledge`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onAcknowledge(alertId);
      }
    } catch (err) {
      console.error("Failed to acknowledge alert:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔔</span> All Alerts
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    alert.severity === "Critical"
                      ? "bg-red-500/10 border-red-500/30"
                      : alert.severity === "High"
                      ? "bg-orange-500/10 border-orange-500/30"
                      : alert.severity === "Medium"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-blue-500/10 border-blue-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{alert.machineName || "System"}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          alert.severity === "Critical"
                            ? "bg-red-500/20 text-red-400"
                            : alert.severity === "High"
                            ? "bg-orange-500/20 text-orange-400"
                            : alert.severity === "Medium"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {alert.severity}
                        </span>
                        {alert.acknowledged && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                            Acknowledged
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mb-1">{alert.message || alert.alertType}</p>
                      <p className="text-xs text-gray-500">
                        {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "Just now"}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert._id)}
                        className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <span className="text-6xl mb-4">✅</span>
              <p className="text-lg font-medium">No alerts</p>
              <p className="text-sm">All systems are running smoothly</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ isOpen, onClose, user, token }) {
  const [settings, setSettings] = useState({
    emailEnabled: true,
    emailAddress: user?.email || "",
    minSeverity: "High",
    dailyDigest: false,
    cooldownMinutes: 15,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [emailStatus, setEmailStatus] = useState({ configured: false });

  // Load settings when modal opens
  useEffect(() => {
    if (isOpen && token) {
      loadSettings();
      checkEmailStatus();
    }
  }, [isOpen, token]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/notifications/settings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSettings({
          emailEnabled: data.emailEnabled ?? true,
          emailAddress: data.emailAddress || user?.email || "",
          minSeverity: data.minSeverity || "High",
          dailyDigest: data.dailyDigest ?? false,
          cooldownMinutes: data.cooldownMinutes || 15,
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkEmailStatus = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEmailStatus(data);
      }
    } catch (err) {
      console.error("Failed to check email status:", err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      
      const res = await fetch("http://localhost:5000/api/notifications/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Failed to save settings" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      setTestingEmail(true);
      setMessage({ type: "", text: "" });
      
      const res = await fetch("http://localhost:5000/api/notifications/test-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: settings.emailAddress }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: "success", text: `Test email sent to ${data.sentTo}!` });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to send test email" });
    } finally {
      setTestingEmail(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Notification Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Status Message */}
            {message.text && (
              <div className={`p-3 rounded-xl text-sm ${
                message.type === "success" 
                  ? "bg-green-500/10 border border-green-500/30 text-green-400" 
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}>
                {message.text}
              </div>
            )}

            {/* Email Configuration Status */}
            <div className={`p-4 rounded-xl ${emailStatus.configured ? "bg-green-500/10 border border-green-500/30" : "bg-yellow-500/10 border border-yellow-500/30"}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emailStatus.configured ? "✅" : "⚠️"}</span>
                <div>
                  <p className={`font-medium ${emailStatus.configured ? "text-green-400" : "text-yellow-400"}`}>
                    {emailStatus.configured ? "Email Server Connected" : "Email Not Configured"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {emailStatus.configured 
                      ? `SMTP: ${emailStatus.smtpHost} (${emailStatus.smtpUser})` 
                      : "Configure SMTP settings in backend .env file"}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Notifications Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {/* Enable Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Enable Email Alerts</p>
                    <p className="text-sm text-gray-500">Receive machine alerts via email</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, emailEnabled: !settings.emailEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors ${settings.emailEnabled ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-transform ${settings.emailEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Notification Email</label>
                  <input
                    type="email"
                    value={settings.emailAddress}
                    onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Minimum Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Alert Severity</label>
                  <select
                    value={settings.minSeverity}
                    onChange={(e) => setSettings({ ...settings, minSeverity: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500"
                  >
                    <option value="Low">Low (All alerts)</option>
                    <option value="Medium">Medium and above</option>
                    <option value="High">High and above</option>
                    <option value="Critical">Critical only</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Only receive alerts at this severity level or higher</p>
                </div>

                {/* Cooldown */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Alert Cooldown (minutes)</label>
                  <input
                    type="number"
                    value={settings.cooldownMinutes}
                    onChange={(e) => setSettings({ ...settings, cooldownMinutes: parseInt(e.target.value) || 15 })}
                    min="1"
                    max="60"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Prevent duplicate alerts within this time period</p>
                </div>

                {/* Daily Digest Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">Daily Digest</p>
                    <p className="text-sm text-gray-500">Receive daily summary email</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, dailyDigest: !settings.dailyDigest })}
                    className={`w-12 h-6 rounded-full transition-colors ${settings.dailyDigest ? 'bg-green-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white mt-0.5 transition-transform ${settings.dailyDigest ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Test Email */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Test Connection</h3>
              <button
                onClick={handleTestEmail}
                disabled={testingEmail || !emailStatus.configured}
                className="w-full py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {testingEmail ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    📧 Send Test Email
                  </>
                )}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Sends a test email to verify your notification setup
              </p>
            </div>

            {/* Account Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Account</h3>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMachines: 0,
    activeMachines: 0,
    alerts: 0,
    uptime: 0,
  });
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [allAlerts, setAllAlerts] = useState([]);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showAddMachine, setShowAddMachine] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch machines
      const machinesRes = await fetch(`${API_URL}/machines`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const machinesData = machinesRes.ok ? await machinesRes.json() : [];
      setMachines(machinesData.slice(0, 5));

      // Fetch alerts
      const alertsRes = await fetch(`${API_URL}/alerts?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const alertsData = alertsRes.ok ? await alertsRes.json() : [];
      const alertsArray = Array.isArray(alertsData) ? alertsData : [];
      setAllAlerts(alertsArray);
      setRecentAlerts(alertsArray.slice(0, 5));

      // Calculate stats
      const activeMachines = machinesData.filter(m => m.status === "Running").length;
      const criticalAlerts = alertsArray.filter(a => a.severity === "Critical" && !a.acknowledged).length;

      setStats({
        totalMachines: machinesData.length,
        activeMachines,
        alerts: criticalAlerts,
        uptime: machinesData.length > 0 ? Math.round((activeMachines / machinesData.length) * 100) : 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMachine = (newMachine) => {
    setMachines((prev) => [newMachine, ...prev].slice(0, 5));
    setStats((prev) => ({
      ...prev,
      totalMachines: prev.totalMachines + 1,
    }));
  };

  const handleAcknowledgeAlert = (alertId) => {
    setAllAlerts((prev) =>
      prev.map((a) => (a._id === alertId ? { ...a, acknowledged: true } : a))
    );
    setRecentAlerts((prev) =>
      prev.map((a) => (a._id === alertId ? { ...a, acknowledged: true } : a))
    );
    // Update critical alerts count
    setStats((prev) => ({
      ...prev,
      alerts: Math.max(0, prev.alerts - 1),
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: "Total Machines",
      value: stats.totalMachines,
      icon: "🏭",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Machines",
      value: stats.activeMachines,
      icon: "⚡",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Critical Alerts",
      value: stats.alerts,
      icon: "🚨",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
    },
    {
      title: "System Uptime",
      value: `${stats.uptime}%`,
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
    },
  ];

  const quickActions = [
    { label: "Monitor Machines", icon: "📊", action: () => navigate("/software"), color: "green" },
    { label: "View Alerts", icon: "🔔", action: () => setShowAlerts(true), color: "red" },
    { label: "Add Machine", icon: "➕", action: () => setShowAddMachine(true), color: "blue" },
    { label: "Settings", icon: "⚙️", action: () => setShowSettings(true), color: "gray" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white pt-20 pb-12">
      <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, <span className="text-green-500">{user?.name?.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-gray-400">
                Here's what's happening with your machines today
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-sm font-medium capitalize">
                {user?.role}
              </span>
              <Link
                to="/software"
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all"
              >
                Open Monitor →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800 border border-gray-700/50 hover:border-gray-600 transition-all text-center group"
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {action.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🔔</span> Recent Alerts
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : recentAlerts.length > 0 ? (
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl border ${
                      alert.severity === "Critical"
                        ? "bg-red-500/10 border-red-500/30"
                        : alert.severity === "High"
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-yellow-500/10 border-yellow-500/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{alert.machineName || "Machine"}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        alert.severity === "Critical"
                          ? "bg-red-500/20 text-red-400"
                          : alert.severity === "High"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{alert.message || alert.alertType}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <span className="text-4xl mb-2">✅</span>
                <p>No recent alerts</p>
              </div>
            )}
          </div>

          {/* Machine Overview */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🏭</span> Machine Overview
            </h2>
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : machines.length > 0 ? (
              <div className="space-y-3">
                {machines.map((machine, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        machine.status === "Running"
                          ? "bg-green-500"
                          : machine.status === "Warning"
                          ? "bg-yellow-500"
                          : machine.status === "Critical"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`} />
                      <div>
                        <p className="font-medium text-sm">{machine.name}</p>
                        <p className="text-xs text-gray-500">{machine.type}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      machine.status === "Running"
                        ? "bg-green-500/10 text-green-400"
                        : machine.status === "Warning"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : machine.status === "Critical"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-gray-500/10 text-gray-400"
                    }`}>
                      {machine.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <span className="text-4xl mb-2">🏭</span>
                <p>No machines added yet</p>
                <Link to="/software" className="text-green-500 text-sm mt-2 hover:underline">
                  Add your first machine →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="text-2xl">👤</span> Your Profile
          </h2>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Full Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Company</p>
                <p className="font-medium">{user?.company || "Not specified"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Role</p>
                <p className="font-medium capitalize">{user?.role}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Member Since</p>
                <p className="font-medium">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Last Login</p>
                <p className="font-medium">
                  {user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "First login"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMachineModal
        isOpen={showAddMachine}
        onClose={() => setShowAddMachine(false)}
        onAdd={handleAddMachine}
        token={token}
      />

      <AlertsModal
        isOpen={showAlerts}
        onClose={() => setShowAlerts(false)}
        alerts={allAlerts}
        token={token}
        onAcknowledge={handleAcknowledgeAlert}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        user={user}
        token={token}
      />
    </div>
  );
}
