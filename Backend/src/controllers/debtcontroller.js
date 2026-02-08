import Debt from "../models/debtManagement.js"
import Savings from "../models/savingGoals.js";
import Expense from "../models/expenseTracking.js";
import { processDebts } from "../utils/processDebts.js";
import { recalculateSavings } from "../utils/recalculateSavings.js";
import { syncCompleteSavings } from "../utils/syncCompleteSavings.js";

/* ======================
   CREATE DEBT
====================== */
export const createDebt = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      title,
      principal,
      interestRate,
      type,
      startDate,
      durationMonths
    } = req.body;

    if (
      !title ||
      !principal ||
      !interestRate ||
      !type ||
      !startDate ||
      !durationMonths
    ) {
      return res.status(400).json({
        message: "All fields required"
      });
    }

    const debt = new Debt({
      user: userId,
      title,
      principal,
      interestRate,
      type,
      startDate,
      durationMonths
    });

    await debt.save();
    

    res.status(201).json({
      message: "Debt created successfully",
      debt
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ======================
   GET USER DEBTS
====================== */
export const getDebts = async (req, res) => {
  try {
    const userId = req.user.id;

    const debts = await Debt.find({ user: userId }).sort({
      createdAt: -1
    });

    const now = new Date();

    const result = debts.map((debt) => {
      const start = new Date(debt.startDate);

      const monthsPassed =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth());

      const totalInterest =
        (debt.principal *
          debt.interestRate *
          debt.durationMonths) /
        100;

      const monthlyInterest =
        totalInterest / debt.durationMonths;

      const monthsLeft = Math.max(
        debt.durationMonths - monthsPassed,
        0
      );

      return {
        _id: debt._id,
        title: debt.title,
        principal: debt.principal,
        interestRate: debt.interestRate,
        type: debt.type,
        startDate: debt.startDate,
        durationMonths: debt.durationMonths,
        active: debt.active,

        // 🔥 Computed Fields
        monthsPassed,
        monthsLeft,
        totalInterest: Number(totalInterest.toFixed(2)),
        monthlyInterest: Number(monthlyInterest.toFixed(2)),
        status: debt.active ? "ACTIVE" : "COMPLETED"
      };
    });
    

    res.json(result);
  } catch (err) {
    console.error("GET DEBTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   DELETE DEBT
====================== */
export const deleteDebt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
      return res.status(400).json({
        message: "Debt ID is required"
      });
    }

    const debt = await Debt.findOne({
      _id: id,
      user: userId
    });

    if (!debt) {
      return res.status(404).json({
        message: "Debt not found or unauthorized"
      });
    }

    // Optional:
    // If you want, you can reverse current month interest impact here
    // But since cron runs monthly, safest is NOT to touch past savings

    await debt.deleteOne();
    

    res.status(200).json({
      message: "Debt deleted successfully",
      deletedDebt: {
        id: debt._id,
        title: debt.title,
        type: debt.type
      }
    });
  } catch (err) {
    console.error("DELETE DEBT ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
