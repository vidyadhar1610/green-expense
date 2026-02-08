import Savings from "../models/savingGoals.js";
import User from "../models/User.js";

/**
 * Sums all monthly savings and updates user.totalSavings
 */
export const calculateTotalSavings = async (userId) => {
  const savingsList = await Savings.find({ user: userId });
  
const totalSavings = savingsList.reduce(
  (sum, s) => sum + (Number(s.savings) || 0),
  0
);

  await User.findByIdAndUpdate(userId, { totalSavings });

  return totalSavings;
};
