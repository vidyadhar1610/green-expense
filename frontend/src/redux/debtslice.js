import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDebts, createDebt, deleteDebt } from "../services/api.js";

/* ======================
   ASYNC ACTIONS
====================== */

export const fetchDebts = createAsyncThunk(
  "debts/fetchDebts",
  async () => {
    const response = await getDebts();
    return Array.isArray(response) ? response : [];
  }
);


export const addDebt = createAsyncThunk(
  "debts/createDebt",
  async (data) => {
    const res = await createDebt(data);
    return res.debt;   // IMPORTANT
  }
);



export const removeDebt = createAsyncThunk(
  "debts/removeDebt",
  async (id) => {
    await deleteDebt(id);
    return id;
  }
);

/* ======================
   SLICE
====================== */

const debtSlice = createSlice({
  name: "debts",
  initialState: {
    list: [],        // ✅ Default empty array to prevent .map errors
    loading: false,  // indicates fetching
    error: null,     // optional: track errors
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH DEBTS
      .addCase(fetchDebts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.list = [];
      })

      // ADD DEBT
      .addCase(addDebt.fulfilled, (state, action) => {
        // Ensure the payload exists before adding
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })

      // REMOVE DEBT
      .addCase(removeDebt.fulfilled, (state, action) => {
        state.list = state.list.filter((d) => d._id !== action.payload);
      })
      .addCase(removeDebt.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default debtSlice.reducer;

