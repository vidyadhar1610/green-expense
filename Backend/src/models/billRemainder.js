import mongoose from "mongoose";

const billReminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    amount: { type: Number, required: true, min: 0 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    reminderSent: { type: Boolean, default: false },
    isRecurring: { type: Boolean, default: false },
    recurrence: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: null },
    category: { type: String, default: "General" }
  },
  { timestamps: true }
);

// Async pre-save hook (no next needed)
billReminderSchema.pre("save", async function () {
  if (this.status === "pending" && this.dueDate < new Date()) {
    this.status = "overdue";
  }
});

// ✅ Fix OverwriteModelError
const BillReminder = mongoose.models.BillReminder || mongoose.model("BillReminder", billReminderSchema);

export default BillReminder;



