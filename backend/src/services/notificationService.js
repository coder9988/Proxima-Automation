import nodemailer from "nodemailer";
import AlertLog from "../models/AlertLog.js";
import NotificationSettings from "../models/NotificationSettings.js";
import User from "../models/User.js";

// Email transporter (configure with your SMTP settings)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

// Cooldown tracker to prevent spam
const alertCooldowns = new Map();

// Check if alert should be sent (respects cooldown)
function shouldSendAlert(machineId, alertType, cooldownMinutes = 15) {
  const key = `${machineId}-${alertType}`;
  const lastSent = alertCooldowns.get(key);
  
  if (lastSent && Date.now() - lastSent < cooldownMinutes * 60 * 1000) {
    return false;
  }
  
  alertCooldowns.set(key, Date.now());
  return true;
}

// Create and optionally send alert
export async function createAlert({
  machineId,
  machineName,
  alertType,
  severity,
  message,
  value,
  threshold,
  unit,
}) {
  try {
    // Create alert log
    const alert = new AlertLog({
      machineId,
      machineName,
      alertType,
      severity,
      message,
      value,
      threshold,
      unit,
    });
    await alert.save();

    // Check if we should send notifications
    if (shouldSendAlert(machineId, alertType)) {
      await sendAlertNotifications(alert);
    }

    return alert;
  } catch (err) {
    console.error("Error creating alert:", err.message);
    return null;
  }
}

// Send notifications to all subscribed users
async function sendAlertNotifications(alert) {
  try {
    // Get all users with email notifications enabled
    const users = await User.find({ isActive: true });
    
    for (const user of users) {
      const settings = await NotificationSettings.findOne({ userId: user._id });
      
      if (!settings || !settings.emailEnabled) continue;
      
      // Check severity filter
      const severityOrder = ["Low", "Medium", "High", "Critical"];
      const alertSeverityIndex = severityOrder.indexOf(alert.severity);
      const minSeverityIndex = severityOrder.indexOf(settings.minSeverity || "High");
      
      if (alertSeverityIndex < minSeverityIndex) continue;
      
      // Send email
      await sendAlertEmail(settings.emailAddress || user.email, alert);
      
      // Mark as sent
      await AlertLog.findByIdAndUpdate(alert._id, { notificationSent: true });
    }
  } catch (err) {
    console.error("Error sending notifications:", err.message);
  }
}

// Send email
async function sendAlertEmail(to, alert) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email Notification] Would send to ${to}:`, alert.alertType, alert.severity);
    return;
  }

  const severityColors = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#22c55e",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #111827; color: #fff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1f2937; border-radius: 12px; overflow: hidden; }
        .header { background: ${severityColors[alert.severity]}; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .alert-info { background: #374151; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .label { color: #9ca3af; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 18px; font-weight: bold; margin-top: 5px; }
        .footer { padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #374151; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ ${alert.severity} Alert</h1>
        </div>
        <div class="content">
          <h2 style="color: #22c55e;">${alert.alertType}</h2>
          <p style="color: #9ca3af;">${alert.message}</p>
          
          <div class="alert-info">
            <div class="label">Machine</div>
            <div class="value">${alert.machineName}</div>
          </div>
          
          <div style="display: flex; gap: 15px;">
            <div class="alert-info" style="flex: 1;">
              <div class="label">Current Value</div>
              <div class="value">${alert.value} ${alert.unit}</div>
            </div>
            <div class="alert-info" style="flex: 1;">
              <div class="label">Threshold</div>
              <div class="value">${alert.threshold} ${alert.unit}</div>
            </div>
          </div>
          
          <div class="alert-info">
            <div class="label">Time</div>
            <div class="value">${new Date(alert.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div class="footer">
          Proxima Automation - Machine Monitoring System
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `[${alert.severity}] ${alert.alertType} - ${alert.machineName}`,
      html,
    });
    console.log(`Alert email sent to ${to}`);
  } catch (err) {
    console.error("Failed to send email:", err.message);
  }
}

// Check metrics and create alerts if thresholds exceeded
export async function checkMetricsForAlerts(machine, metrics) {
  const thresholds = {
    temperature: { max: 90, severity: "Critical", unit: "°C" },
    vibration: { max: 12, severity: "High", unit: "mm/s" },
    current: { max: 65, severity: "High", unit: "A" },
    voltageMin: { min: 205, severity: "Medium", unit: "V" },
    voltageMax: { max: 245, severity: "Medium", unit: "V" },
    pressure: { max: 8, severity: "Medium", unit: "bar" },
    humidity: { max: 80, severity: "Low", unit: "%" },
  };

  // Temperature check
  if (metrics.temperature > thresholds.temperature.max) {
    await createAlert({
      machineId: machine._id,
      machineName: machine.name,
      alertType: "Overheating",
      severity: thresholds.temperature.severity,
      message: `Temperature exceeded safe limit of ${thresholds.temperature.max}°C`,
      value: metrics.temperature,
      threshold: thresholds.temperature.max,
      unit: thresholds.temperature.unit,
    });
  }

  // Vibration check
  if (metrics.vibration > thresholds.vibration.max) {
    await createAlert({
      machineId: machine._id,
      machineName: machine.name,
      alertType: "High Vibration",
      severity: thresholds.vibration.severity,
      message: `Vibration exceeded safe limit of ${thresholds.vibration.max} mm/s`,
      value: metrics.vibration,
      threshold: thresholds.vibration.max,
      unit: thresholds.vibration.unit,
    });
  }

  // Current check
  if (metrics.current > thresholds.current.max) {
    await createAlert({
      machineId: machine._id,
      machineName: machine.name,
      alertType: "Overload Current",
      severity: thresholds.current.severity,
      message: `Current exceeded safe limit of ${thresholds.current.max} A`,
      value: metrics.current,
      threshold: thresholds.current.max,
      unit: thresholds.current.unit,
    });
  }

  // Voltage check
  if (metrics.voltage < thresholds.voltageMin.min) {
    await createAlert({
      machineId: machine._id,
      machineName: machine.name,
      alertType: "Voltage Deviation",
      severity: thresholds.voltageMin.severity,
      message: `Voltage dropped below minimum of ${thresholds.voltageMin.min} V`,
      value: metrics.voltage,
      threshold: thresholds.voltageMin.min,
      unit: thresholds.voltageMin.unit,
    });
  } else if (metrics.voltage > thresholds.voltageMax.max) {
    await createAlert({
      machineId: machine._id,
      machineName: machine.name,
      alertType: "Voltage Deviation",
      severity: thresholds.voltageMax.severity,
      message: `Voltage exceeded maximum of ${thresholds.voltageMax.max} V`,
      value: metrics.voltage,
      threshold: thresholds.voltageMax.max,
      unit: thresholds.voltageMax.unit,
    });
  }
}

export default { createAlert, checkMetricsForAlerts };
