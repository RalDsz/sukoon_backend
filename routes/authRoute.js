import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate JWT 
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required (name, email, password, role)" });
    }
    if (name.length < 3) {
      return res.status(400).json({ message: "Name must be at least 3 characters" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!["child", "therapist"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'child' or 'therapist'" });
    }

    // Check if user exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Avatar
    const profilePicture = `https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(name)}`;

    // ✅ password is hashed automatically in schema
    const user = new User({ name, email, password, role, profilePicture });
    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// VERIFY TOKEN
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Token valid",
      token,
      user,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
