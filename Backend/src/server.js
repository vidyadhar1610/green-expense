import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import expense from "./routes/expense.routes.js";
import savings from "./routes/savinggoal.routes.js";
import { startDebtCron } from "./cron/debtCron.js";
import debtRoutes from "./routes/debt.routes.js";

// ✅ Import Bill Reminder Routes
import billReminderRoutes from "./routes/billremainder.routes.js";

import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    // 🔁 Start cron AFTER DB connects
    startDebtCron();

    // Mount routes
    app.use("/api/auth", authRoutes);
    app.use("/api/expense", expense);
    app.use("/api/savings", savings);
    app.use("/api/debts", debtRoutes);

    // ✅ Mount Bill Reminder Routes
    app.use("/api/bills", billReminderRoutes);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

