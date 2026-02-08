import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDebts, addDebt, removeDebt } from "../redux/debtslice";
import { markExpensesDirty } from "../redux/uiSlice";
import { Trash2 } from "lucide-react";

export default function DebtManagement() {
  const dispatch = useDispatch();
  const { list = [], loading } = useSelector((state) => state.debts || { list: [], loading: false });

  const [form, setForm] = useState({
    title: "",
    principal: "",
    interestRate: "",
    type: "GIVEN",
    durationMonths: "",
    startDate: "",
  });

  const [error, setError] = useState(null);

  /* =======================
     INITIAL LOAD
  ======================= */
  useEffect(() => {
    dispatch(fetchDebts()).unwrap().catch((err) => console.error("Failed to fetch debts:", err));
  }, [dispatch]);

  /* =======================
     HANDLE FORM CHANGE
  ======================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =======================
     ADD DEBT
  ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(addDebt(form)).unwrap(); // ✅ unwrap for proper async handling
      dispatch(markExpensesDirty()); // notify Expense page to refresh
      await dispatch(fetchDebts()).unwrap(); // refresh debts list
      // reset form
      setForm({
        title: "",
        principal: "",
        interestRate: "",
        type: "GIVEN",
        durationMonths: "",
        startDate: "",
      });
    } catch (err) {
      console.error("Failed to add debt:", err);
      setError("Failed to add debt. Please try again.");
    }
  };

  /* =======================
     REMOVE DEBT
  ======================= */
  const handleRemoveDebt = async (id) => {
    setError(null);
    try {
      await dispatch(removeDebt(id)).unwrap();
      dispatch(markExpensesDirty());
      await dispatch(fetchDebts()).unwrap();
    } catch (err) {
      console.error("Failed to remove debt:", err);
      setError("Failed to remove debt. Please try again.");
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Debt Management</h1>

      {/* =======================
           FORM
      ======================= */}
      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-4 bg-white shadow-xl rounded-2xl p-6 mb-8"
      >
        <input
          name="title"
          placeholder="Debt Title"
          value={form.title}
          onChange={handleChange}
          className="border p-3 rounded-xl"
          required
        />

        <input
          name="principal"
          type="number"
          placeholder="Principal Amount"
          value={form.principal}
          onChange={handleChange}
          className="border p-3 rounded-xl"
          required
        />

        <input
          name="interestRate"
          type="number"
          placeholder="Interest %"
          value={form.interestRate}
          onChange={handleChange}
          className="border p-3 rounded-xl"
          required
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-3 rounded-xl"
        >
          <option value="GIVEN">Given</option>
          <option value="TAKEN">Taken</option>
        </select>

        <input
          name="durationMonths"
          type="number"
          placeholder="Duration (months)"
          value={form.durationMonths}
          onChange={handleChange}
          className="border p-3 rounded-xl"
          required
        />

        <input
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          className="border p-3 rounded-xl"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition col-span-full"
        >
          Add Debt
        </button>
      </form>

      {/* =======================
           ERROR MESSAGE
      ======================= */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* =======================
           LIST
      ======================= */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading && <p>Loading debts...</p>}

        {list.length === 0 && !loading && <p>No debts added yet.</p>}

        {list.map((debt) => (
          <div
            key={debt._id}
            className="bg-white rounded-2xl shadow-lg p-5 flex justify-between items-center"
          >
            <div>
              <h2 className="text-lg font-semibold text-green-700">{debt.title}</h2>
              <p>Principal: ₹{debt.principal}</p>
              <p>Interest: {debt.interestRate}%</p>
              <p>Type: {debt.type}</p>
              <p>Duration: {debt.durationMonths} months</p>
            </div>

            <button
              onClick={() => handleRemoveDebt(debt._id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

