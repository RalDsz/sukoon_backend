// models/therapist.js
import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  speciality: { type: String, required: true },
  availableSlots: [{ type: String }], // e.g., ["10:00 AM", "2:00 PM"]
});

const Therapist = mongoose.model("Therapist", therapistSchema);

export default Therapist;
