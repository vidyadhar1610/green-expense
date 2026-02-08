import express from "express";
import {
  calculateMonthlySavings,
  getCurrentSavings,
  addExtraIncome
  
} from "../controllers/savinggoalcontroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/calculate", authMiddleware, calculateMonthlySavings);
router.get("/current",authMiddleware, getCurrentSavings);
router.post("/extra-income",authMiddleware,addExtraIncome);


export default router;
