import Expense from "../models/expenseTracking.js";
import Savings from "../models/savingGoals.js";
import User from "../models/User.js";
import { recalculateSavings } from "../utils/recalculateSavings.js";
import { syncCompleteSavings } from "../utils/syncCompleteSavings.js";

/* ======================
   HELPER
====================== */
const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth(), // 0-11
    year: now.getFullYear(),
  };
};

/* ======================
   CALCULATE MONTHLY SAVINGS
====================== */
export const calculateMonthlySavings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = getCurrentMonthYear();
    const { income, incomeType } = req.body;

    if (!income || income <= 0) {
      return res.status(400).json({ message: "Invalid income amount" });
    }

    // Convert everything into monthly income
    let totalIncome =
      incomeType === "Monthly" || incomeType === "PocketMoney"
        ? Number(income)
        : Number(income) / 12;

    let savingsDoc = await Savings.findOne({ user: userId, month, year });

    if (!savingsDoc) {
      savingsDoc = new Savings({
        user: userId,
        month,
        year,
        income: totalIncome,
        incomeType,
        extraIncome: 0,
        expense: 0,
        savings: 0,
      });
    } else {
      savingsDoc.income = totalIncome;
      savingsDoc.incomeType = incomeType;
    }

    await savingsDoc.save();

    // 🔁 Recalculate savings
    const updatedSavings = await recalculateSavings(userId, month, year);
    const totalSavings = await syncCompleteSavings(userId);

    res.status(200).json({
      monthlySavings: updatedSavings,
      totalSavings,
    });
  } catch (err) {
    console.error("CALCULATE SAVINGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   ADD EXTRA INCOME
====================== */
export const addExtraIncome = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = getCurrentMonthYear();
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    let savingsDoc = await Savings.findOne({ user: userId, month, year });

    if (!savingsDoc) {
      savingsDoc = new Savings({
        user: userId,
        month,
        year,
        income: 0,
        extraIncome: Number(amount), // ✅ FIXED
        expense: 0,
        savings: 0,
      });
    } else {
      savingsDoc.extraIncome =
        (savingsDoc.extraIncome || 0) + Number(amount); // ✅ FIXED
    }

    await savingsDoc.save();

    // 🔁 Recalculate everything
    const updatedSavings = await recalculateSavings(userId, month, year);
    const totalSavings = await syncCompleteSavings(userId);

    res.status(200).json({
      message: "Extra income added successfully",
      monthlySavings: updatedSavings,
      totalSavings,
    });
  } catch (err) {
    console.error("ADD EXTRA INCOME ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   GET CURRENT SAVINGS
====================== */
export const getCurrentSavings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = getCurrentMonthYear();

    const currentSavings = await Savings.findOne({
      user: userId,
      month,
      year,
    });

    if (!currentSavings) {
      return res.status(200).json({
        savings: null,
        message: "No savings calculated for current month",
      });
    }

    // ✅ Always calculate total safely
    const totalSavings = await syncCompleteSavings(userId);

    const baseIncome = currentSavings.income || 0;
    const extraIncome = currentSavings.extraIncome || 0;
    const totalIncome = baseIncome + extraIncome;

    res.status(200).json({
      savings: {
        month: currentSavings.month,
        year: currentSavings.year,
        baseIncome,
        extraIncome,
        totalIncome,
        expense: currentSavings.expense || 0,
        savings: currentSavings.savings || 0, // monthly savings
        completeSavings: totalSavings, // all-time savings
      },
    });
  } catch (err) {
    console.log("Authorization header:", req.headers.authorization);
    console.error("GET CURRENT SAVINGS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ======================
   SAVINGS HISTORY
====================== */
export const getSavingsHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const history = await Savings.find({
      user: userId,
      $or: [
        { year: { $lt: currentYear } },
        { year: currentYear, month: { $lt: currentMonth } },
      ],
    })
      .sort({ year: -1, month: -1 })
      .select("month year savings expense income extraIncome");

    res.status(200).json({ history });
  } catch (err) {
    console.error("SAVINGS HISTORY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
