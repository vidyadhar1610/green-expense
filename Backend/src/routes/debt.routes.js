import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
  createDebt,
  getDebts,
  deleteDebt
} from "../controllers/debtcontroller.js";

const router = express.Router();

/* ======================
   DEBT ROUTES
====================== */

// ➕ Create new debt
router.post("/", protect, createDebt);

// 📄 Get all user debts (active + completed)
router.get("/", protect, getDebts);
router.delete("/:id", protect, deleteDebt);

export default router;
