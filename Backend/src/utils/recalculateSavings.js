import Expense from "../models/expenseTracking.js";
import Savings from "../models/savingGoals.js";

export const recalculateSavings = async (userId, month, year) => {
  // 1️⃣ Get existing savings (income already stored)
  const savingsDoc = await Savings.findOne({ user: userId, month, year });

  if (!savingsDoc) return null;

  const currentincome = (savingsDoc.income || 0) + (savingsDoc.extraIncome || 0);


  // 2️⃣ Recalculate expenses
  const expenses = await Expense.find({ user: userId });
  let totalExpense = 0;

  expenses.forEach((exp) => {
    const expDate = new Date(exp.date);

    if (exp.expenseType === "Yearly") {
      totalExpense += exp.amount / 12;
    } else {
      if (
        expDate.getMonth() === month &&
        expDate.getFullYear() === year
      ) {
        totalExpense += exp.amount;
      }
    }
  });

  // 3️⃣ Update savings
  savingsDoc.expense = totalExpense;
  savingsDoc.savings = currentincome - totalExpense;

  await savingsDoc.save();
  return savingsDoc;
};
