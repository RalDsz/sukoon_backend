import mongoose from "mongoose"


const appointmentSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  therapist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Therapist",
    required: true,
  },
  date: {
    type: String, // e.g. "2025-09-08"
    required: true,
  },
  startTime: {
    type: String, // "10:00 AM"
    required: true,
  },
  endTime: {
    type: String, // "10:30 AM" (makes duration flexible)
    required: true,
  },
  duration: {
    type: Number, // minutes, e.g. 30
    default: 30,
  },
  status: {
    type: String,
    enum: ["booked", "rescheduled", "cancelled", "completed"],
    default: "booked",
  },
  mode: {
    type: String,
    enum: ["in-person", "virtual"], // in case you later add video sessions
    default: "virtual",
  },
  meetingLink: {
    type: String, // e.g. Zoom/Meet link (auto-generate if needed)
    default: "",
  },
  notes: {
    type: String, // child/therapist notes
    maxlength: 500,
  },
  reminderSent: {
    type: Boolean,
    default: false, // you can flip this when a push notification/email is sent
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update timestamps on save
appointmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
