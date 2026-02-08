import User from '../models/User.js';
import Expense from '../models/expenseTracking.js';
import { recalculateSavings } from "../utils/recalculateSavings.js";
import { syncCompleteSavings } from '../utils/syncCompleteSavings.js';
export const addexpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      date, // 👈 USER ENTERED DATE
      category,
      expensetype,
      frequency,
      paymentmethod,
      expenselimit,
      notes
    } = req.body;

    const requiredFields = [
      "title",
      "amount",
      "category",
      "expensetype",
      "paymentmethod",
      "date" // 👈 make date required
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    // ✅ Validate and convert date
    const userDate = new Date(date);
    if (isNaN(userDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format"
      });
    }

    const expense = new Expense({
      user: req.user.id,   // 🔥 from JWT middleware
      title: title.trim(),
      amount: Number(amount),
      date: userDate, // ✅ SAVE USER DATE
      category,
      expenseType: expensetype,
      frequency,
      paymentMethod: paymentmethod,
      expenseLimit: expenselimit,
      notes
    });

    await expense.save();
    const now = new Date(date);
    const nmonth = now.getMonth();
    const nyear = now.getFullYear();
    // 🔁 AUTO-UPDATE SAVINGS BASED ON EXPENSE DATE
    

    await recalculateSavings(req.user.id, nmonth, nyear);
    await syncCompleteSavings(req.user.id);

    // ✅ Send response ONCE, at the end
    return res.status(201).json({
      message: "Expense added successfully",
      expense
    });

  } catch (error) {
    console.error("Add Expense Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



export const removeexpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    if (!expenseId) {
      return res.status(400).json({
        message: "Expense ID is required"
      });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: expenseId,
      user: req.user.id   // 🔐 ensures ownership
    });

    if (!deletedExpense) {
      return res.status(404).json({
        message: "Expense not found or unauthorized"
      });
    }
    const now = new Date(deletedExpense.date);
    const nmonth = now.getMonth();
    const nyear = now.getFullYear();
    // 🔁 AUTO-UPDATE SAVINGS BASED ON EXPENSE DATE
    

    await recalculateSavings(req.user.id, nmonth, nyear);
    await syncCompleteSavings(req.user.id);

    res.status(200).json({
      message: "Expense removed successfully",
      expense: deletedExpense
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



export const updateExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId;

    const expense = await Expense.findOne({
      _id: expenseId,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const allowedFields = [
      "title",
      "amount",
      "category",
      "expenseType",
      "frequency",
      "paymentMethod",
      "expenseLimit",
      "notes"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    Object.assign(expense, updates);
    await expense.save();
    const now = new Date(expense.date);
    const nmonth = now.getMonth();
    const nyear = now.getFullYear();
    // 🔁 AUTO-UPDATE SAVINGS BASED ON EXPENSE DATE
    

    await recalculateSavings(req.user.id, nmonth, nyear);
    await syncCompleteSavings(req.user.id);

    res.json({
      message: "Expense updated successfully",
      expense
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json({ expenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
