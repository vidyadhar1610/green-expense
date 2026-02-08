import express from "express";
import {
  createBill,
  getBills,
  getBillById,
  updateBill,
  markBillPaid,
  deleteBill
} from "../controllers/remaindercontroller.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Base route: /api/bills
 */

// Create bill & Get all bills
router.route("/")
  .post(protect, createBill)
  .get(protect, getBills);

// Get, Update, Delete single bill
router.route("/:id")
  .get(protect, getBillById)
  .put(protect, updateBill)
  .delete(protect, deleteBill);

// Mark bill as paid
router.patch("/:id/pay", protect, markBillPaid);

export default router;
