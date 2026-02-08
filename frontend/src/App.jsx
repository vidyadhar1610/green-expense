
import { Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Main from "./pages/Main";
import Dashboard from "./pages/dashboard";
import ExpenseTracking from "./pages/ExpenseTracking";
import SavingsGoals from "./pages/SavingsGoals";
import DebtManagement from "./pages/DebtManagement";
import BillReminders from "./pages/BillReminders";
import FinancialGoalPlanning from "./pages/FinancialGoalPlanning";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<Login />} />

      {/* Protected Layout */}
      <Route element={<Main />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpenseTracking />} />
        <Route path="/savings" element={<SavingsGoals />} />
        <Route path="/debt" element={<DebtManagement />} />
        <Route path="/reminders" element={<BillReminders />} />
        <Route path="/goals" element={<FinancialGoalPlanning />} />
      </Route>
    </Routes>
  );
}

export default App;



// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Login from './pages/login';
// import Main from './pages/Main';

// import Dashboard from './pages/dashboard';
// import ExpenseTracking from './pages/ExpenseTracking';
// import SavingsGoals from './pages/SavingsGoals';
// import DebtManagement from './pages/DebtManagement';
// import BillReminders from './pages/BillReminders';
// import FinancialGoalPlanning from './pages/FinancialGoalPlanning';


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Public route */}
//         <Route path="/" element={<Login />} />

//         {/* Protected Layout */}
//         <Route element={<Main />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/expenses" element={<ExpenseTracking />} />
//           <Route path="/savings" element={<SavingsGoals />} />
//           <Route path="/debt" element={<DebtManagement />} />
//           <Route path="/reminders" element={<BillReminders />} />
//           <Route path="/goals" element={<FinancialGoalPlanning />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

