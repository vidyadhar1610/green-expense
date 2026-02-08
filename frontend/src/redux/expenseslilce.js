import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../services/api.js";
// import { fetchBalance } from "./savingslice.js";

/* ======================
   ASYNC ACTIONS
====================== */

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async () => {
    const response = await getExpenses();
    return response.expenses;
  }
);

export const createExpense = createAsyncThunk(
  "expenses/create",
  async (data, { dispatch }) => {
    // Wait for backend to create expense
    const res = await addExpense(data);

    // Now backend has processed the new expense, fetch updated savings
    // await dispatch(fetchBalance());

    return res.expense;
  }
);


export const editExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, data }, { dispatch }) => {
    const res = await updateExpense(id, data);

    // Wait for savings refresh
    // await dispatch(fetchBalance());

    return res.expense;
  }
);

export const removeExpense = createAsyncThunk(
  "expenses/delete",
  async (id, { dispatch }) => {
    await deleteExpense(id);

    // await dispatch(fetchBalance());

    return id;
  }
);


/* ======================
   SLICE
====================== */

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    list: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      })

      // CREATE
      .addCase(createExpense.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })

      // UPDATE
      .addCase(editExpense.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE
      .addCase(removeExpense.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (e) => e._id !== action.payload
        );
      });
  },
});

export default expenseSlice.reducer;
