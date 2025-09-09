// routes/AppointmentRoute.js
import express from "express";
import Appointment from "../models/Appointments.js";

const router = express.Router();

// ✅ Test route
router.get("/test", (req, res) => {
  res.send("✅ Appointment routes working");
});

// ✅ Create new appointment
// POST /api/appointments
router.post("/", async (req, res) => {
  try {
    const { childId, therapistId, date, startTime, endTime, notes, mode } =
      req.body;

    if (!childId || !therapistId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newAppointment = new Appointment({
      child: childId,
      therapist: therapistId,
      date,
      startTime,
      endTime,
      notes,
      mode,
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get all appointments
// GET /api/appointments
router.get("/", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("child", "name email")
      .populate("therapist", "name speciality");
    res.json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/child/:childId", async (req, res) => {
  try {
    const { childId } = req.params;
    const { date } = req.query;

    if (!childId) {
      return res.status(400).json({ error: "Child ID is required" });
    }

    const query = { child: childId };

    if (date) {
      query.date = date; // make sure your model stores date as string (YYYY-MM-DD) or convert accordingly
    }

    const appointments = await Appointment.find(query)
      .populate("child", "name email")
      .populate("therapist", "name speciality");

    res.json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments by child:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
