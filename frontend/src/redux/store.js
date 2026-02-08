import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseslilce.js";
import savingsReducer from "./savingslice.js";
import debtReducer from "./debtslice.js";   // NEW
import uiReducer from "./uiSlice.js";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    savings: savingsReducer,
    debts: debtReducer,   // NEW
    ui:uiReducer
  },
});

export default store;
