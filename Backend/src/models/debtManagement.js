import mongoose from "mongoose";

const debtSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    principal: {
      type: Number,
      required: true,
      min: 1
    },

    interestRate: {
      type: Number, // monthly %
      required: true
    },

    type: {
      type: String,
      enum: ["GIVEN", "TAKEN"],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    durationMonths: {
      type: Number,
      required: true
    },

    lastProcessedMonth: {
      type: String, // "YYYY-MM"
      default: null
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Debt", debtSchema);
