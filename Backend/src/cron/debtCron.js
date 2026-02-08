import cron from "node-cron";
import { processDebts } from "../utils/processDebts.js";

export const startDebtCron = () => {
  console.log("Debt cron initialized");

  cron.schedule("* * * * *", async () => {
    try {
      console.log("Processing monthly debts...");
      await processDebts();
      console.log("Debt processing completed");
    } catch (err) {
      console.error("Debt cron failed:", err);
    }
  });
};
