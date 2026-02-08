import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';

const Main = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
        navigate('/'); // token invalid → logout
      }
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* Sidebar */}
      <div
        style={{
          width: '250px',
          backgroundColor: '#1f2937',
          color: '#fff',
          padding: '20px'
        }}
      >
        <h3 style={{ marginBottom: '30px' }}>
          {user ? `👋 ${user.username}` : 'Loading...'}
        </h3>

        <div className="nav-item" onClick={() => navigate('/dashboard')}>
          Dashboard
        </div>
        <div className="nav-item" onClick={() => navigate('/expenses')}>
          Expense Tracking
        </div>
        <div className="nav-item" onClick={() => navigate('/savings')}>
          Savings Goals
        </div>
        <div className="nav-item" onClick={() => navigate('/debt')}>
          Debt Management
        </div>
        <div className="nav-item" onClick={() => navigate('/reminders')}>
          Bill Reminders
        </div>
        <div className="nav-item" onClick={() => navigate('/goals')}>
          Financial Goals
        </div>
      </div>

      {/* Page Content */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <Outlet />
      </div>

    </div>
  );
};

export default Main;



// import { useEffect, useState } from 'react';

// export default function Dashboard() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (!token) return;

//     fetch('http://localhost:5000/api/user/profile', {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUser(data); // { username }
//       })
//       .catch(err => console.error(err));
//   }, []);

//   return (
//     <div>
//       {user ? `Welcome, ${user.username}` : 'Loading...'}
//     </div>
//   );
// }




// import { useEffect } from 'react';

// const Main = () => {
//   return (
//     <div className="bg-white text-gray-800">
//       {/* Navbar */}
//       <header className="sticky top-0 bg-white border-b border-gray-200 p-5 flex justify-between items-center z-50">
//         <h1 className="text-2xl font-bold text-green-600">GreenExpense</h1>
//         <nav className="flex gap-4">
//           <a href="/" className="text-teal-700 font-medium hover:text-green-600">Home</a>
//           <a href="#" className="text-teal-700 font-medium hover:text-green-600">About</a>
//           <a href="#" className="text-teal-700 font-medium hover:text-green-600">Features</a>
//           <a href="#" className="text-teal-700 font-medium hover:text-green-600">Profile</a>
//         </nav>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-green-50 h-screen p-6 sticky top-0 border-r border-gray-200">
//           <h3 className="text-xl font-semibold text-teal-700 mb-6">Features</h3>
//           <ul className="flex flex-col gap-4">
//             <li><a href="#" className="block py-2 px-4 rounded hover:bg-green-200 text-green-700">Expense Tracking</a></li>
//             <li><a href="#" className="block py-2 px-4 rounded hover:bg-green-200 text-green-700">Goal Setting</a></li>
//             <li><a href="#" className="block py-2 px-4 rounded hover:bg-green-200 text-green-700">Insights & Reports</a></li>
//             <li><a href="#" className="block py-2 px-4 rounded hover:bg-green-200 text-green-700">Debt Management</a></li>
//             <li><a href="#" className="block py-2 px-4 rounded hover:bg-green-200 text-green-700">Reminders</a></li>
//             <li><a href="#" className="block py-2 px-4 rounded hover:bg-green-200 text-green-700">Savings</a></li>
//           </ul>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6">
//           <section className="bg-green-100 text-center py-24 px-6 mb-20 rounded-lg">
//             <h2 className="text-5xl text-teal-700 font-bold mb-5">
//               Your Path to Financial Freedom Starts Here
//             </h2>
//             <p className="text-lg mb-8">
//               GreenExpense helps individuals manage daily expenses, save smarter,
//               and reach their financial goals.
//             </p>
//           </section>

//           <section className="py-20 px-6 text-center">
//             <h3 className="text-3xl text-teal-700 font-semibold mb-10">Features</h3>
//             <div className="flex flex-wrap justify-center gap-8">
//               {[
//                 "Expense Tracking",
//                 "Goal Setting",
//                 "Insights & Reports",
//                 "Debt Management",
//                 "Reminders",
//                 "Savings",
//               ].map((title) => (
//                 <div
//                   key={title}
//                   className="bg-white p-8 rounded-xl shadow-lg w-72 transform hover:-translate-y-1 transition-transform"
//                 >
//                   <h4 className="text-green-600 font-bold mb-4">{title}</h4>
//                   <p>Feature description goes here.</p>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </main>
//       </div>

//       <footer className="bg-green-900 text-green-100 text-center py-6 mt-6">
//         <p>© 2025 GreenExpense. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default Main;

