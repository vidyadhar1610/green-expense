import Savings from "../models/savingGoals.js";

import { calculateTotalSavings } from "./calculateTotalSavings.js";

export const syncCompleteSavings = async (userId) => {
  const totalSavings = await calculateTotalSavings(userId);

  await Savings.updateMany(
    { user: userId },
    { $set: { completeSavings: totalSavings } }
  );

  return totalSavings;
};