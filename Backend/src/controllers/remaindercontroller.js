import BillReminder from "../models/billRemainder.js";

/**
 * @desc    Create a new bill
 * @route   POST /api/bills
 * @access  Private
 */
export const createBill = async (req, res) => {
  try {
    const bill = await BillReminder.create({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      amount: Number(req.body.amount),
      dueDate: new Date(req.body.dueDate),
      isRecurring: req.body.isRecurring || false,
      recurrence: req.body.recurrence || null,
      category: req.body.category || "General",
    });

    res.status(201).json(bill);
  } catch (err) {
    console.error("Create Bill Error:", err);
    res.status(500).json({ message: "Failed to create bill" });
  }
};

/**
 * @desc    Get all bills for logged-in user
 * @route   GET /api/bills
 * @access  Private
 */
export const getBills = async (req, res) => {
  try {
    const bills = await BillReminder.find({ user: req.user.id }).sort({
      dueDate: 1
    });

    res.status(200).json(bills);
  } catch (error) {
    console.error("Get Bills Error:", error);
    res.status(500).json({ message: "Failed to fetch bills" });
  }
};

/**
 * @desc    Get single bill by ID
 * @route   GET /api/bills/:id
 * @access  Private
 */
export const getBillById = async (req, res) => {
  try {
    const bill = await BillReminder.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Get Bill By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch bill" });
  }
};

/**
 * @desc    Update a bill
 * @route   PUT /api/bills/:id
 * @access  Private
 */
export const updateBill = async (req, res) => {
  try {
    const bill = await BillReminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Update Bill Error:", error);
    res.status(500).json({ message: "Failed to update bill" });
  }
};

/**
 * @desc    Mark bill as paid
 * @route   PATCH /api/bills/:id/pay
 * @access  Private
 */
export const markBillPaid = async (req, res) => {
  try {
    const bill = await BillReminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        status: "paid",
        reminderSent: true
      },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    console.error("Mark Paid Error:", error);
    res.status(500).json({ message: "Failed to mark bill as paid" });
  }
};

/**
 * @desc    Delete a bill
 * @route   DELETE /api/bills/:id
 * @access  Private
 */
export const deleteBill = async (req, res) => {
  try {
    const bill = await BillReminder.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill deleted successfully" });
  } catch (error) {
    console.error("Delete Bill Error:", error);
    res.status(500).json({ message: "Failed to delete bill" });
  }
};
