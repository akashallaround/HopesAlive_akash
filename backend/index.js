import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/ConnectDB.js";
import userRoutes from "./Routes/userRoutes.js";
import cookieParser from "cookie-parser";
import incidentRoutes from "./Routes/incidentRoutes.js";
import ngoRoutes from "./Routes/NgoRoutes.js";
import volunteerRoutes from "./Routes/volunteerRoutes.js";
import cors from "cors";
import docuSignRoutes from "./Routes/docuSignRoutes.js";
import petRoutes from "./Routes/petRoutes.js";

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file.");
  process.exit(1);
}
if (!process.env.PORT) {
  console.error("❌ PORT is missing in .env file.");
  process.exit(1);
}

// Initialize app
const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: ["https://hopesalive-iqub.vercel.app", "http://localhost:3000"], // Allow both production and development URLs
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true // Allow credentials
  })
);

// Manually set headers (extra layer of protection)
app.use((req, res, next) => {
  const allowedOrigins = ["https://hopesalive-iqub.vercel.app", "http://localhost:3000"];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/uploads", express.static("uploads"));
app.use("/api/docusign", docuSignRoutes);
app.use("/api/pets", petRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running with updated CORS settings!");
});

// Start server
app.listen(port, async () => {
  await connectDB(process.env.MONGO_URI);
  console.log(`🚀 Server is running on port ${port}`);
});
