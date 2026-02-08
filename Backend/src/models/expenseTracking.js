import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title:{
      type : String,
      required: true,
      trim : true,
    },
    
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Food",
        "Shopping",
        "Travel",
        "Entertainment",
        "Rent",
        "Groceries",
        "Electricity",
        "Water",
        "OTT",
        "Mobile",
        "Education",
        "Other",
      ],
    },
    expenseType: {
      type: String,
      required: true,
      enum: ["Daily", "Monthly", "Yearly"],
    },

    frequency: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly"],
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    
    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "Credit Card",
        "Debit Card",
        "Net Banking",
        "UPI",
        "Other",
      ],
      default: "Cash",
    },
    expenseLimit: {
      type: Number,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

ExpenseSchema.index({ user: 1, date: -1 });
const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
// export const Expense=mongoose.model('Expense',ExpenseSchema);