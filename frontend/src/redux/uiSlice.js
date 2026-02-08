import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    expensesDirty: false,
  },
  reducers: {
    markExpensesDirty: (state) => {
      state.expensesDirty = true;
    },
    clearExpensesDirty: (state) => {
      state.expensesDirty = false;
    },
  },
});

export const { markExpensesDirty, clearExpensesDirty } = uiSlice.actions;
export default uiSlice.reducer;
