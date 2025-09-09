import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/authRoute.js";
import therapistRoute from "./routes/therapistRoute.js"
import appointmentRoute from "./routes/AppointmentRoute.js"

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.url);
  next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/therapist", therapistRoute)
app.use("/api/appointments", appointmentRoute)

// Initiating server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.log("❌ Error connecting to MongoDB:", error.message);
  }
};

startServer();
