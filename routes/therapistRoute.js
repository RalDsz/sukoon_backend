import express from "express";
import Therapist from "../models/Therapist.js";

const router = express.Router();

// Seed therapists
router.post("/seed", async (req, res) => {
  try {
    const therapists = req.body; // expects array
    await Therapist.deleteMany(); // clear old data
    const created = await Therapist.insertMany(therapists);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all therapists
router.get("/", async (req, res) => {
  try {
    const therapists = await Therapist.find();
    res.json(therapists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router; // ✅ default export
