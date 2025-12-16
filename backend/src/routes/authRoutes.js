import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import NotificationSettings from "../models/NotificationSettings.js";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "proxima-automation-secret-key-2024";
const JWT_EXPIRES_IN = "7d";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Middleware to verify token
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, company, phone, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user
    const user = new User({ 
      name, 
      email, 
      password, 
      company, 
      phone,
      role: role || "operator" 
    });
    await user.save();

    // Create default notification settings
    await NotificationSettings.create({ 
      userId: user._id,
      emailAddress: email 
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const settings = await NotificationSettings.findOne({ userId: req.user._id });
    res.json({ user, notificationSettings: settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, company, phone, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, company, phone, avatar },
      { new: true }
    );

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Change password
router.put("/password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get notification settings
router.get("/notifications", authMiddleware, async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ userId: req.user._id });
    
    if (!settings) {
      settings = await NotificationSettings.create({ 
        userId: req.user._id,
        emailAddress: req.user.email 
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update notification settings
router.put("/notifications", authMiddleware, async (req, res) => {
  try {
    const settings = await NotificationSettings.findOneAndUpdate(
      { userId: req.user._id },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );

    res.json({ message: "Settings updated", settings });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Get all users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update user role
router.patch("/users/:id/role", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    res.json({ message: "Role updated", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Logout (client-side token removal, but we can track it)
router.post("/logout", authMiddleware, async (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
