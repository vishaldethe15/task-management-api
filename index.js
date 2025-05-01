import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// === Middleware ===

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Basic Test Route ===
app.get("/", (req, res) => {
  res.send("Task Management API is running 🚀");
});

// === Add your routes here ===
// import taskRoutes from './routes/task.routes.js';
// app.use('/api/tasks', taskRoutes);

app.use("/api/auth", authRouter);

// === Start Server ===
const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
