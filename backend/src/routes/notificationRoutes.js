import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import NotificationSettings from "../models/NotificationSettings.js";
import User from "../models/User.js";

const router = express.Router();

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No token provided" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "proxima-automation-secret-key-2024");
    req.userId = decoded.id; // Token uses 'id' not 'userId'
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Get notification settings for current user
router.get("/settings", auth, async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ userId: req.userId });
    
    if (!settings) {
      const user = await User.findById(req.userId);
      settings = new NotificationSettings({
        userId: req.userId,
        emailAddress: user.email,
        emailEnabled: true,
        minSeverity: "High",
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update notification settings
router.put("/settings", auth, async (req, res) => {
  try {
    const { 
      emailEnabled, 
      emailAddress, 
      minSeverity, 
      cooldownMinutes,
      dailyDigest,
      thresholds 
    } = req.body;
    
    let settings = await NotificationSettings.findOne({ userId: req.userId });
    
    if (!settings) {
      settings = new NotificationSettings({ userId: req.userId });
    }
    
    if (emailEnabled !== undefined) settings.emailEnabled = emailEnabled;
    if (emailAddress) settings.emailAddress = emailAddress;
    if (minSeverity) settings.minSeverity = minSeverity;
    if (cooldownMinutes) settings.cooldownMinutes = cooldownMinutes;
    if (dailyDigest !== undefined) settings.dailyDigest = dailyDigest;
    if (thresholds) settings.thresholds = { ...settings.thresholds, ...thresholds };
    
    settings.updatedAt = new Date();
    await settings.save();
    
    res.json({ message: "Settings updated", settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test email notification
router.post("/test-email", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const settings = await NotificationSettings.findOne({ userId: req.userId });
    const emailTo = req.body.email || settings?.emailAddress || user.email;
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({ 
        message: "Email not configured. Please set SMTP_USER and SMTP_PASS in .env file.",
        configured: false 
      });
    }
    
    const transporter = createTransporter();
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #111827; color: #fff; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1f2937; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #22c55e, #10b981); padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; color: white; }
          .content { padding: 30px; }
          .success-box { background: #22c55e20; border: 1px solid #22c55e50; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .success-icon { font-size: 48px; margin-bottom: 10px; }
          .info-box { background: #374151; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .label { color: #9ca3af; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
          .value { font-size: 16px; color: white; }
          .footer { padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #374151; }
          .button { display: inline-block; background: linear-gradient(135deg, #22c55e, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Email Test Successful</h1>
          </div>
          <div class="content">
            <div class="success-box">
              <div class="success-icon">🎉</div>
              <h2 style="color: #22c55e; margin: 0;">Connection Verified!</h2>
              <p style="color: #9ca3af; margin-top: 10px;">Your email notifications are configured correctly.</p>
            </div>
            
            <div class="info-box">
              <div class="label">Account</div>
              <div class="value">${user.name} (${user.email})</div>
            </div>
            
            <div class="info-box">
              <div class="label">Notification Email</div>
              <div class="value">${emailTo}</div>
            </div>
            
            <div class="info-box">
              <div class="label">Test Time</div>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
            
            <p style="color: #9ca3af; text-align: center; margin-top: 20px;">
              You will now receive real-time alerts when machine metrics exceed thresholds.
            </p>
          </div>
          <div class="footer">
            <p>Proxima Automation - Machine Monitoring System</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    await transporter.sendMail({
      from: `"Proxima Automation" <${process.env.SMTP_USER}>`,
      to: emailTo,
      subject: "✅ Test Email - Proxima Automation Notifications",
      html,
    });
    
    res.json({ 
      message: "Test email sent successfully!", 
      sentTo: emailTo,
      configured: true 
    });
  } catch (err) {
    console.error("Email test failed:", err);
    res.status(500).json({ 
      message: `Failed to send test email: ${err.message}`,
      configured: false 
    });
  }
});

// Send custom notification to user
router.post("/send", auth, async (req, res) => {
  try {
    const { to, subject, message, severity = "Medium" } = req.body;
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({ message: "Email not configured" });
    }
    
    const transporter = createTransporter();
    
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
          body { font-family: Arial, sans-serif; background: #111827; color: #fff; padding: 20px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; background: #1f2937; border-radius: 12px; overflow: hidden; }
          .header { background: ${severityColors[severity]}; padding: 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; color: white; }
          .content { padding: 30px; }
          .message { background: #374151; padding: 20px; border-radius: 8px; }
          .footer { padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 ${subject}</h1>
          </div>
          <div class="content">
            <div class="message">
              <p style="color: white; margin: 0; line-height: 1.6;">${message}</p>
            </div>
            <p style="color: #9ca3af; text-align: center; margin-top: 20px; font-size: 12px;">
              Sent: ${new Date().toLocaleString()}
            </p>
          </div>
          <div class="footer">
            Proxima Automation - Machine Monitoring System
          </div>
        </div>
      </body>
      </html>
    `;
    
    await transporter.sendMail({
      from: `"Proxima Automation" <${process.env.SMTP_USER}>`,
      to,
      subject: `[Proxima] ${subject}`,
      html,
    });
    
    res.json({ message: "Notification sent successfully", sentTo: to });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send alert notification to multiple operators
router.post("/broadcast", auth, async (req, res) => {
  try {
    const { alertType, machineName, severity, message, value, threshold, unit } = req.body;
    
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(400).json({ message: "Email not configured" });
    }
    
    // Get all users with email notifications enabled
    const settings = await NotificationSettings.find({ emailEnabled: true });
    const userIds = settings.map(s => s.userId);
    const users = await User.find({ _id: { $in: userIds }, isActive: true });
    
    const transporter = createTransporter();
    const sentTo = [];
    
    const severityColors = {
      Critical: "#ef4444",
      High: "#f97316",
      Medium: "#eab308",
      Low: "#22c55e",
    };
    
    for (const setting of settings) {
      const user = users.find(u => u._id.toString() === setting.userId.toString());
      if (!user) continue;
      
      // Check severity threshold
      const severityOrder = ["Low", "Medium", "High", "Critical"];
      const alertSeverityIndex = severityOrder.indexOf(severity);
      const minSeverityIndex = severityOrder.indexOf(setting.minSeverity || "High");
      
      if (alertSeverityIndex < minSeverityIndex) continue;
      
      const emailTo = setting.emailAddress || user.email;
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background: #111827; color: #fff; padding: 20px; margin: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1f2937; border-radius: 12px; overflow: hidden; }
            .header { background: ${severityColors[severity]}; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; color: white; }
            .content { padding: 30px; }
            .alert-info { background: #374151; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .label { color: #9ca3af; font-size: 12px; text-transform: uppercase; }
            .value { font-size: 18px; font-weight: bold; margin-top: 5px; color: white; }
            .metrics { display: flex; gap: 15px; }
            .metric-box { flex: 1; background: #374151; padding: 15px; border-radius: 8px; text-align: center; }
            .footer { padding: 20px; text-align: center; color: #9ca3af; font-size: 12px; border-top: 1px solid #374151; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ ${severity} Alert</h1>
            </div>
            <div class="content">
              <h2 style="color: #22c55e; margin-top: 0;">${alertType}</h2>
              <p style="color: #9ca3af;">${message}</p>
              
              <div class="alert-info">
                <div class="label">Machine</div>
                <div class="value">${machineName}</div>
              </div>
              
              <div class="metrics">
                <div class="metric-box">
                  <div class="label">Current Value</div>
                  <div class="value" style="color: ${severityColors[severity]};">${value} ${unit}</div>
                </div>
                <div class="metric-box">
                  <div class="label">Threshold</div>
                  <div class="value">${threshold} ${unit}</div>
                </div>
              </div>
              
              <div class="alert-info">
                <div class="label">Time</div>
                <div class="value">${new Date().toLocaleString()}</div>
              </div>
              
              <p style="color: #9ca3af; text-align: center; margin-top: 20px;">
                Please check the machine status and take necessary action.
              </p>
            </div>
            <div class="footer">
              <p>Proxima Automation - Machine Monitoring System</p>
              <p>You received this because you're subscribed to ${setting.minSeverity}+ alerts</p>
            </div>
          </div>
        </body>
        </html>
      `;
      
      try {
        await transporter.sendMail({
          from: `"Proxima Automation" <${process.env.SMTP_USER}>`,
          to: emailTo,
          subject: `[${severity}] ${alertType} - ${machineName}`,
          html,
        });
        sentTo.push(emailTo);
      } catch (emailErr) {
        console.error(`Failed to send to ${emailTo}:`, emailErr.message);
      }
    }
    
    res.json({ 
      message: `Alert broadcast to ${sentTo.length} operators`, 
      sentTo 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get email configuration status
router.get("/status", auth, async (req, res) => {
  const configured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
  res.json({
    configured,
    smtpHost: process.env.SMTP_HOST || "smtp.gmail.com",
    smtpUser: configured ? process.env.SMTP_USER.replace(/(.{3}).*(@.*)/, "$1***$2") : null,
  });
});

export default router;
