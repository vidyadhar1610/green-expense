import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  createExpense,
  editExpense,
  removeExpense,
} from "../redux/expenseslilce";
import {
  clearExpensesDirty,
} from "../redux/uiSlice";

/* =======================
   HELPER FUNCTIONS
======================= */
const getMonthYear = (date) => {
  const d = new Date(date);
  return `${d.getMonth()}-${d.getFullYear()}`;
};

const formatMonthYear = (date) => {
  const d = new Date(date);
  return d.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
};

export default function ExpenseTracking() {
  const dispatch = useDispatch();

  const { list: expenses, loading, error } = useSelector(
    (state) => state.expenses
  );

  const expensesDirty = useSelector(
    (state) => state.ui.expensesDirty
  );

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    expensetype: "",
    frequency: "",
    paymentmethod: "",
    expenselimit: "",
    notes: "",
  });

  /* =======================
     REFRESH FUNCTION
  ======================= */
  const refreshExpenses = () => {
    dispatch(fetchExpenses());
  };

  /* =======================
     INITIAL LOAD
  ======================= */
  useEffect(() => {
    refreshExpenses();
  }, [dispatch]);

  /* =======================
     REFRESH WHEN DEBT PAGE
     MODIFIES EXPENSES
  ======================= */
  useEffect(() => {
    if (expensesDirty) {
      refreshExpenses();
      dispatch(clearExpensesDirty());
    }
  }, [expensesDirty, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =======================
     MODAL HANDLERS
  ======================= */
  const openAddModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      amount: "",
      date: "",
      category: "",
      expensetype: "",
      frequency: "",
      paymentmethod: "",
      expenselimit: "",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingId(expense._id);
    setForm({
      title: expense.title || "",
      amount: expense.amount || "",
      date: expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : "",
      category: expense.category || "",
      expensetype: expense.expenseType || "",
      frequency: expense.frequency || "",
      paymentmethod: expense.paymentMethod || "",
      expenselimit: expense.expenseLimit || "",
      notes: expense.notes || "",
    });
    setShowModal(true);
  };

  const saveExpense = async () => {
    if (!form.title || !form.amount || !form.date) {
      alert("Title, Amount and Date are required");
      return;
    }

    if (editingId) {
       dispatch(editExpense({ id: editingId, data: form }));
    } else {
       dispatch(createExpense(form));
    }

    refreshExpenses();
    setShowModal(false);
  };

  const deleteExpenseById = async (id) => {
    if (window.confirm("Delete this expense?")) {
     dispatch(removeExpense(id));
      refreshExpenses();
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={openAddModal}
        style={{
          background: "#16a34a",
          color: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        Add Expense
      </button>

      {loading && <p>Loading expenses...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {expenses.map((exp, index) => {
          const currentMonth = getMonthYear(exp.date);
          const previousMonth =
            index > 0 ? getMonthYear(expenses[index - 1].date) : null;

          const showDivider =
            index !== 0 && currentMonth !== previousMonth;

          return (
            <div key={exp._id}>
              {showDivider && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    borderTop: "3px solid #16a34a",
                    margin: "30px 0 15px",
                    paddingTop: "10px",
                    textAlign: "center",
                    fontWeight: "bold",
                    color: "#166534",
                  }}
                >
                  {formatMonthYear(exp.date)}
                </div>
              )}

              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "14px",
                  background: "#f0fdf4",
                }}
              >
                <h3 style={{ color: "#166534" }}>{exp.title}</h3>
                <p>₹ {exp.amount}</p>
                <p>{exp.category}</p>
                <small>{new Date(exp.date).toLocaleDateString()}</small>
                <br />
                <br />

                <button
                  onClick={() => openEditModal(exp)}
                  style={{
                    marginRight: "8px",
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExpenseById(exp._id)}
                  style={{
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* =======================
           MODAL
      ======================= */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              width: "400px",
              padding: "20px",
              borderRadius: "12px",
            }}
          >
            <h2>{editingId ? "Update Expense" : "Add Expense"}</h2>

            {Object.keys(form).map((key) =>
              key === "notes" ? (
                <textarea
                  key={key}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  key={key}
                  type={key === "date" ? "date" : "text"}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                />
              )
            )}

            <button onClick={saveExpense}>Save</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchExpenses,
//   createExpense,
//   editExpense,
//   removeExpense,
// } from "../redux/expenseslilce";

// /* =======================
//    HELPER FUNCTIONS
// ======================= */
// const getMonthYear = (date) => {
//   const d = new Date(date);
//   return `${d.getMonth()}-${d.getFullYear()}`;
// };

// const formatMonthYear = (date) => {
//   const d = new Date(date);
//   return d.toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });
// };

// export default function ExpenseTracking() {
//   const dispatch = useDispatch();
//   const { list: expenses, loading,error } = useSelector(
//     (state) => state.expenses
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     amount: "",
//     date: "", // ✅ NEW
//     category: "",
//     expensetype: "",
//     frequency: "",
//     paymentmethod: "",
//     expenselimit: "",
//     notes: "",
//   });

//   useEffect(() => {
//     dispatch(fetchExpenses());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* =======================
//      MODAL HANDLERS
//   ======================= */
//   const openAddModal = () => {
//     setEditingId(null);
//     setForm({
//       title: "",
//       amount: "",
//       date: "", // ✅ NEW
//       category: "",
//       expensetype: "",
//       frequency: "",
//       paymentmethod: "",
//       expenselimit: "",
//       notes: "",
//     });
//     setShowModal(true);
//   };

//   const openEditModal = (expense) => {
//     setEditingId(expense._id);
//     setForm({
//       title: expense.title || "",
//       amount: expense.amount || "",
//       date: expense.date
//         ? new Date(expense.date).toISOString().split("T")[0]
//         : "", // ✅ Proper format for date input
//       category: expense.category || "",
//       expensetype: expense.expenseType || "",
//       frequency: expense.frequency || "",
//       paymentmethod: expense.paymentMethod || "",
//       expenselimit: expense.expenseLimit || "",
//       notes: expense.notes || "",
//     });
//     setShowModal(true);
//   };

//   const saveExpense = () => {
//     if (!form.title || !form.amount || !form.date) {
//       alert("Title, Amount and Date are required");
//       return;
//     }

//     if (editingId) {
//       dispatch(editExpense({ id: editingId, data: form }));
//     } else {
//       dispatch(createExpense(form));
//     }
//     setShowModal(false);
//   };

//   const deleteExpenseById = (id) => {
//     if (window.confirm("Delete this expense?")) {
//       dispatch(removeExpense(id));
//     }
//   };

//   /* =======================
//      UI
//   ======================= */
//   return (
//     <div style={{ padding: "20px" }}>
//       <button
//         onClick={openAddModal}
//         style={{
//           background: "#16a34a",
//           color: "white",
//           padding: "10px 16px",
//           borderRadius: "8px",
//           border: "none",
//           cursor: "pointer",
//         }}
//       >
//         Add Expense
//       </button>

//       {loading && <p>Loading expenses...</p>}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//           gap: "16px",
//           marginTop: "20px",
//         }}
//       >
//         {expenses.map((exp, index) => {
//           const currentMonth = getMonthYear(exp.date);
//           const previousMonth =
//             index > 0 ? getMonthYear(expenses[index - 1].date) : null;

//           const showDivider =
//             index !== 0 && currentMonth !== previousMonth;

//           return (
//             <div key={exp._id}>
//               {showDivider && (
//                 <div
//                   style={{
//                     gridColumn: "1 / -1",
//                     borderTop: "3px solid #16a34a",
//                     margin: "30px 0 15px",
//                     paddingTop: "10px",
//                     textAlign: "center",
//                     fontWeight: "bold",
//                     color: "#166534",
//                   }}
//                 >
//                   {formatMonthYear(exp.date)}
//                 </div>
//               )}

//               <div
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "10px",
//                   padding: "14px",
//                   background: "#f0fdf4",
//                 }}
//               >
//                 <h3 style={{ color: "#166534" }}>{exp.title}</h3>
//                 <p>₹ {exp.amount}</p>
//                 <p>{exp.category}</p>
//                 <small>
//                   {new Date(exp.date).toLocaleDateString()}
//                 </small>
//                 <br />
//                 <br />

//                 <button
//                   onClick={() => openEditModal(exp)}
//                   style={{
//                     marginRight: "8px",
//                     background: "#22c55e",
//                     color: "white",
//                     border: "none",
//                     padding: "6px 10px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Edit
//                 </button>

//                 <button
//                   onClick={() => deleteExpenseById(exp._id)}
//                   style={{
//                     background: "#dc2626",
//                     color: "white",
//                     border: "none",
//                     padding: "6px 10px",
//                     borderRadius: "6px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* =======================
//            MODAL
//       ======================= */}
//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 50,
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               width: "400px",
//               padding: "20px",
//               borderRadius: "12px",
//               boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h2 style={{ color: "#166534" }}>
//               {editingId ? "Update Expense" : "Add Expense"}
//             </h2>

//             {Object.keys(form).map((key) => {
//               if (key === "notes") {
//                 return (
//                   <textarea
//                     key={key}
//                     name={key}
//                     placeholder={key}
//                     value={form[key]}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       marginTop: "8px",
//                       borderRadius: "6px",
//                     }}
//                   />
//                 );
//               }

//               if (key === "date") {
//                 return (
//                   <input
//                     key={key}
//                     type="date"
//                     name={key}
//                     value={form[key]}
//                     onChange={handleChange}
//                     style={{
//                       width: "100%",
//                       padding: "8px",
//                       marginTop: "8px",
//                       borderRadius: "6px",
//                     }}
//                   />
//                 );
//               }

//               return (
//                 <input
//                   key={key}
//                   name={key}
//                   placeholder={key}
//                   value={form[key]}
//                   onChange={handleChange}
//                   style={{
//                     width: "100%",
//                     padding: "8px",
//                     marginTop: "8px",
//                     borderRadius: "6px",
//                   }}
//                 />
//               );
//             })}

//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "flex-end",
//                 marginTop: "12px",
//               }}
//             >
//               <button
//                 onClick={saveExpense}
//                 style={{
//                   background: "#16a34a",
//                   color: "white",
//                   border: "none",
//                   padding: "8px 14px",
//                   borderRadius: "6px",
//                   marginRight: "8px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 style={{
//                   background: "#6b7280",
//                   color: "white",
//                   border: "none",
//                   padding: "8px 14px",
//                   borderRadius: "6px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchExpenses,
//   createExpense,
//   editExpense,
//   removeExpense,
// } from "../redux/expenseslilce";

// /* =======================
//    HELPER FUNCTIONS
// ======================= */
// const getMonthYear = (date) => {
//   const d = new Date(date);
//   return `${d.getMonth()}-${d.getFullYear()}`;
// };

// const formatMonthYear = (date) => {
//   const d = new Date(date);
//   return d.toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });
// };

// export default function ExpenseTracking() {
//   const dispatch = useDispatch();
//   const { list: expenses, loading } = useSelector(
//     (state) => state.expenses
//   );

//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     amount: "",
//     category: "",
//     expensetype: "",
//     frequency: "",
//     paymentmethod: "",
//     expenselimit: "",
//     notes: "",
//   });

//   useEffect(() => {
//     dispatch(fetchExpenses());
//   }, [dispatch]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const openAddModal = () => {
//     setEditingId(null);
//     setForm({
//       title: "",
//       amount: "",
//       category: "",
//       expensetype: "",
//       frequency: "",
//       paymentmethod: "",
//       expenselimit: "",
//       notes: "",
//     });
//     setShowModal(true);
//   };

//   const openEditModal = (expense) => {
//     setEditingId(expense._id);
//     setForm({
//       title: expense.title,
//       amount: expense.amount,
//       category: expense.category,
//       expensetype: expense.expenseType,
//       frequency: expense.frequency,
//       paymentmethod: expense.paymentMethod,
//       expenselimit: expense.expenseLimit,
//       notes: expense.notes,
//     });
//     setShowModal(true);
//   };

//   const saveExpense = () => {
//     if (editingId) {
//       dispatch(editExpense({ id: editingId, data: form }));
//     } else {
//       dispatch(createExpense(form));
//     }
//     setShowModal(false);
//   };

//   const deleteExpenseById = (id) => {
//     dispatch(removeExpense(id));
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <button onClick={openAddModal}>Add Expense</button>

//       {loading && <p>Loading expenses...</p>}

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//           gap: "16px",
//           marginTop: "20px",
//         }}
//       >
//         {expenses.map((exp, index) => {
//           const currentMonth = getMonthYear(exp.date);
//           const previousMonth =
//             index > 0 ? getMonthYear(expenses[index - 1].date) : null;

//           const showDivider =
//             index !== 0 && currentMonth !== previousMonth;

//           return (
//             <div key={exp._id}>
//               {showDivider && (
//                 <div
//                   style={{
//                     gridColumn: "1 / -1",
//                     borderTop: "3px solid #000",
//                     margin: "30px 0 15px",
//                     paddingTop: "10px",
//                     textAlign: "center",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {formatMonthYear(exp.date)}
//                 </div>
//               )}

//               <div
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   padding: "12px",
//                 }}
//               >
//                 <h3>{exp.title}</h3>
//                 <p>₹ {exp.amount}</p>
//                 <p>{exp.category}</p>
//                 <small>
//                   {new Date(exp.date).toLocaleDateString()}
//                 </small>
//                 <br />

//                 <button onClick={() => openEditModal(exp)}>
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deleteExpenseById(exp._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               width: "400px",
//               margin: "10% auto",
//               padding: "20px",
//               borderRadius: "8px",
//             }}
//           >
//             <h2>{editingId ? "Update Expense" : "Add Expense"}</h2>

//             {Object.keys(form).map((key) =>
//               key === "notes" ? (
//                 <textarea
//                   key={key}
//                   name={key}
//                   placeholder={key}
//                   value={form[key]}
//                   onChange={handleChange}
//                 />
//               ) : (
//                 <input
//                   key={key}
//                   name={key}
//                   placeholder={key}
//                   value={form[key]}
//                   onChange={handleChange}
//                 />
//               )
//             )}

//             <button onClick={saveExpense}>Save</button>
//             <button onClick={() => setShowModal(false)}>
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import {
//   addExpense,
//   getExpenses,
//   updateExpense,
//   deleteExpense,
// } from "../services/api";

// /* =======================
//    HELPER FUNCTIONS (NEW)
// ======================= */
// const getMonthYear = (date) => {
//   const d = new Date(date);
//   return `${d.getMonth()}-${d.getFullYear()}`;
// };

// const formatMonthYear = (date) => {
//   const d = new Date(date);
//   return d.toLocaleString("default", {
//     month: "long",
//     year: "numeric",
//   });
// };

// export default function Tracking() {
//   const [expenses, setExpenses] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     title: "",
//     amount: "",
//     category: "",
//     expensetype: "",
//     frequency: "",
//     paymentmethod: "",
//     expenselimit: "",
//     notes: "",
//   });

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   /* =======================
//      FETCH + SORT EXPENSES
//   ======================= */
//   const fetchExpenses = async () => {
//     const data = await getExpenses();

//     const sortedExpenses = data.expenses.sort(
//       (a, b) => new Date(b.date) - new Date(a.date)
//     );

//     setExpenses(sortedExpenses);
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const openAddModal = () => {
//     setEditingId(null);
//     setForm({
//       title: "",
//       amount: "",
//       category: "",
//       expensetype: "",
//       frequency: "",
//       paymentmethod: "",
//       expenselimit: "",
//       notes: "",
//     });
//     setShowModal(true);
//   };

//   const openEditModal = (expense) => {
//     setEditingId(expense._id);
//     setForm({
//       title: expense.title,
//       amount: expense.amount,
//       category: expense.category,
//       expensetype: expense.expenseType,
//       frequency: expense.frequency,
//       paymentmethod: expense.paymentMethod,
//       expenselimit: expense.expenseLimit,
//       notes: expense.notes,
//     });
//     setShowModal(true);
//   };

//   const saveExpense = async () => {
//     if (editingId) {
//       await updateExpense(editingId, form);
//     } else {
//       await addExpense(form);
//     }
//     setShowModal(false);
//     fetchExpenses();
//   };

//   const deleteExpenseById = async (id) => {
//     await deleteExpense(id);
//     fetchExpenses();
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <button onClick={openAddModal}>Add Expense</button>

//       {/* =======================
//           EXPENSE LIST WITH
//           MONTH SEPARATORS
//       ======================= */}
//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
//           gap: "16px",
//           marginTop: "20px",
//         }}
//       >
//         {expenses.map((exp, index) => {
//           const currentMonth = getMonthYear(exp.date);
//           const previousMonth =
//             index > 0 ? getMonthYear(expenses[index - 1].date) : null;

//           const showDivider =
//             index !== 0 && currentMonth !== previousMonth;

//           return (
//             <div key={exp._id}>
//               {showDivider && (
//                 <div
//                   style={{
//                     gridColumn: "1 / -1",
//                     borderTop: "3px solid #000",
//                     margin: "30px 0 15px",
//                     paddingTop: "10px",
//                     textAlign: "center",
//                     fontWeight: "bold",
//                   }}
//                 >
//                   {formatMonthYear(exp.date)}
//                 </div>
//               )}

//               <div
//                 style={{
//                   border: "1px solid #ccc",
//                   borderRadius: "8px",
//                   padding: "12px",
//                 }}
//               >
//                 <h3>{exp.title}</h3>
//                 <p>₹ {exp.amount}</p>
//                 <p>{exp.category}</p>
//                 <small>
//                   {new Date(exp.date).toLocaleDateString()}
//                 </small>
//                 <br />

//                 <button onClick={() => openEditModal(exp)}>Edit</button>
//                 <button onClick={() => deleteExpenseById(exp._id)}>
//                   Delete
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* =======================
//           MODAL (UNCHANGED)
//       ======================= */}
//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.4)",
//           }}
//         >
//           <div
//             style={{
//               background: "white",
//               width: "400px",
//               margin: "10% auto",
//               padding: "20px",
//               borderRadius: "8px",
//             }}
//           >
//             <h2>{editingId ? "Update Expense" : "Add Expense"}</h2>

//             <input
//               name="title"
//               placeholder="Title"
//               value={form.title}
//               onChange={handleChange}
//             />
//             <input
//               name="amount"
//               placeholder="Amount"
//               value={form.amount}
//               onChange={handleChange}
//             />
//             <input
//               name="category"
//               placeholder="Category"
//               value={form.category}
//               onChange={handleChange}
//             />
//             <input
//               name="expensetype"
//               placeholder="Expense Type"
//               value={form.expensetype}
//               onChange={handleChange}
//             />
//             <input
//               name="paymentmethod"
//               placeholder="Payment Method"
//               value={form.paymentmethod}
//               onChange={handleChange}
//             />
//             <input
//               name="frequency"
//               placeholder="Frequency"
//               value={form.frequency}
//               onChange={handleChange}
//             />
//             <input
//               name="expenselimit"
//               placeholder="Expense Limit"
//               value={form.expenselimit}
//               onChange={handleChange}
//             />
//             <textarea
//               name="notes"
//               placeholder="Notes"
//               value={form.notes}
//               onChange={handleChange}
//             />

//             <button onClick={saveExpense}>Save</button>
//             <button onClick={() => setShowModal(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

