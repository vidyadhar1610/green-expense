import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCurrentSavings,
  calculateMonthlySavings,
} from "../services/api.js";

/* ======================
   ASYNC ACTIONS
====================== */

export const fetchBalance = createAsyncThunk(
  "savings/fetchBalance",
  async () => {
    const response = await getCurrentSavings();
    return response.savings;
  }
);

// export const calculateSavings = createAsyncThunk(
//   "savings/calculateSavings",
//   async (data) => {
//     const response = await calculateMonthlySavings(data);
//     return response.savings;
//   }
// );

/* ======================
   SLICE
====================== */

const balanceSlice=createSlice({
    name:'balance',
    initialState:{
        monthlySavings:null,
        totalSavings:0,
        status:'idle',
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchBalance.pending,(state)=>{
            state.status='loading';
        })
        .addCase(fetchBalance.fulfilled, (state, action) => {
            state.status = "succeeded";
            if(action.payload){
                state.monthlySavings = action.payload;
                state.totalSavings = action.payload.completeSavings;
            } else {
                state.monthlySavings = null;
                state.totalSavings = 0;
            }
        })

        .addCase(fetchBalance.rejected,(state,action)=>{
            state.status='failed';
            state.error=action.error.message;
        });
    }
})


export default balanceSlice.reducer;
