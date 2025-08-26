import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import conversationsRoutes from "./routes/conversations.js";

dotenv.config();
const app = express();
console.log("Gemini API Key:", process.env.GEMINI_API_KEY);

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173", credentials: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationsRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
