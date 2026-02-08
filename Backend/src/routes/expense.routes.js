import express from "express";
import { addexpense,updateExpense,removeexpense,getExpenses } from "../controllers/expensecontroller.js";
import authMiddleware from "../middleware/authMiddleware.js"

const router = express.Router();

router.post('/', authMiddleware, addexpense);
router.patch('/:expenseId', authMiddleware, updateExpense);
router.delete('/:expenseId', authMiddleware, removeexpense);
router.get('/', authMiddleware, getExpenses);



export default router;

