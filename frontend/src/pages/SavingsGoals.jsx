import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BaseIncomeForm from "../components/BaseIncomeForm";
import ExtraIncomeForm from "../components/ExtraIncomeForm";
import {
  fetchBalance,
  
  
} from "../redux/savingslice";

export default function SavingsGoals() {
  const dispatch = useDispatch();
  const { monthlySavings,totalSavings,status,error } = useSelector(
    (state) => state.savings
  );
  

  

  useEffect(() => {
    dispatch(fetchBalance());
  }, [dispatch]);

if(status === 'loading') return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;


  return (
    <div>
      <h2>Savings Dashboard</h2>

      <BaseIncomeForm refresh={()=>{
        dispatch(fetchBalance());
      }} />
      <ExtraIncomeForm refresh={()=>{ 
        dispatch(fetchBalance());
      }} />

      {monthlySavings ? (
        <div>
          <p>Base Income: ₹{monthlySavings.baseIncome}</p>
          <p>Extra Income: ₹{monthlySavings.extraIncome}</p>
          <p><b>Total Income:</b> ₹{monthlySavings.totalIncome}</p>

          <p>Expenses: ₹{monthlySavings.expense}</p>
          <p><b>Monthly Savings:</b> ₹{monthlySavings.savings}</p>

          <hr />

          <p><b>Total Savings:</b> ₹{totalSavings}</p>
        </div>
      ) : (
        <p>No savings data for this month</p>
      )}
    </div>
  );
};




// import { useEffect, useState } from "react";
// import {
//   getCurrentSavings,
//   calculateMonthlySavings,
// } from "../services/api";

// export default function MonthlySavings() {
//   const [savings, setSavings] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [form, setForm] = useState({
//     income: "",
//     incomeType: "",
//   });

//   /* ======================
//      FETCH SAVINGS
//   ======================= */
//   const fetchSavings = async () => {
//     const data = await getCurrentSavings();
//     setSavings(data.savings || null);
//   };

//   useEffect(() => {
//     fetchSavings();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const openModal = () => {
//     setForm({ income: "", incomeType: "" });
//     setShowModal(true);
//   };

//   const calculate = async () => {
//     await calculateMonthlySavings(form);
//     setShowModal(false);
//     fetchSavings();
//   };

//   return (
//     <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
//       <h2 style={{ textAlign: "center" }}>💰 Savings Overview</h2>

//       <button onClick={openModal}>➕ Add Income</button>

//       {/* ======================
//           SAVINGS CARDS
//       ======================= */}
//       {savings && (
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
//             gap: "20px",
//             marginTop: "30px",
//           }}
//         >
//           {/* Monthly Savings */}
//           <div
//             style={{
//               padding: "20px",
//               borderRadius: "12px",
//               background: "#e8f5e9",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: "40px" }}>📅</div>
//             <h3>Monthly Savings</h3>
//             <p style={{ fontSize: "22px", color: "green" }}>
//               ₹ {savings.savings}
//             </p>
//           </div>

//           {/* Total Savings */}
//           <div
//             style={{
//               padding: "20px",
//               borderRadius: "12px",
//               background: "#e3f2fd",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: "40px" }}>🏦</div>
//             <h3>Total Savings</h3>
//             <p style={{ fontSize: "22px", color: "#0d47a1" }}>
//               ₹ {savings.completeSavings}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* ======================
//           MODAL
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
//               borderRadius: "10px",
//             }}
//           >
//             <h3>Add Income</h3>

//             <input
//               type="number"
//               name="income"
//               placeholder="Income Amount"
//               value={form.income}
//               onChange={handleChange}
//               style={{ width: "100%", marginBottom: "10px" }}
//             />

//             <select
//               name="incomeType"
//               value={form.incomeType}
//               onChange={handleChange}
//               style={{ width: "100%", marginBottom: "15px" }}
//             >
//               <option value="">Select Income Type</option>
//               <option value="Monthly">Monthly</option>
//               <option value="PocketMoney">Pocket Money</option>
//               <option value="Scholarship">Scholarship</option>
//               <option value="Yearly">Yearly</option>
//             </select>

//             <button onClick={calculate}>Calculate</button>
//             <button onClick={() => setShowModal(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




















