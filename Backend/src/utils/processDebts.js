import Debt from "../models/debtManagement.js";
import Savings from "../models/savingGoals.js";
import Expense from "../models/expenseTracking.js";
import { recalculateSavings } from "./recalculateSavings.js";
import { syncCompleteSavings } from "./syncCompleteSavings.js";

/* ======================
   HELPERS
====================== */
const getMonthKey = (date) => {
  return `${date.getFullYear()}-${date.getMonth()}`;
};

const getMonthYear = (date) => {
  return {
    month: date.getMonth()+1,
    year: date.getFullYear(),
  };
};

/* ======================
   MAIN PROCESSOR
====================== */
export const processDebts = async () => {
  const now = new Date();
  const monthKey = getMonthKey(now);

  const activeDebts = await Debt.find({ active: true });

  for (const debt of activeDebts) {
    try {
      // 🔒 Prevent double processing
      if (debt.lastProcessedMonth === monthKey) continue;

      const start = new Date(debt.startDate);
      const monthsPassed =
        (now.getFullYear() - start.getFullYear()) * 12 +
        (now.getMonth() - start.getMonth());

      // ⛔ Expire debt
      if (monthsPassed >= debt.durationMonths) {
        debt.active = false;
        await debt.save();
        continue;
      }

      // ==========================
      // SIMPLE INTEREST LOGIC
      // ==========================
      const P = debt.principal;
      const R = debt.interestRate;
      const T = debt.durationMonths;

      const totalInterest = (P * R * T) / 100;
      const monthlyInterest = totalInterest / T;

      const { month, year } = getMonthYear(now);

      // ==========================
      // GIVEN → INCOME
      // ==========================
      if (debt.type === "GIVEN") {
        let savingsDoc = await Savings.findOne({
          user: debt.user,
          month,
          year,
        });

        if (!savingsDoc) {
          savingsDoc = new Savings({
            user: debt.user,
            month,
            year,
            income: 0,
            extraIncome: 0,
            expense: 0,
            savings: 0,
          });
        }

        savingsDoc.extraIncome =
          (savingsDoc.extraIncome || 0) + monthlyInterest;

        await savingsDoc.save();
      }

      // ==========================
      // TAKEN → EXPENSE
      // ==========================
      else {
        const expense = new Expense({
          user: debt.user,
          title: `Debt Interest - ${debt.title}`,
          amount: monthlyInterest,
          date: now,
          category: "Other",
          expenseType: "Monthly",
          paymentMethod: "Other",
          notes: `Monthly interest for ${month + 1}/${year}`,
        });

        await expense.save();
      }

      // ==========================
      // RECALCULATE SAVINGS
      // ==========================
      await recalculateSavings(debt.user, month, year);
      await syncCompleteSavings(debt.user);

      // ==========================
      // MARK PROCESSED
      // ==========================
      debt.lastProcessedMonth = monthKey;
      await debt.save();

    } catch (err) {
      console.error("DEBT PROCESSING ERROR:", err);
    }
  }
};
