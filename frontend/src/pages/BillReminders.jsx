import { useEffect, useState } from "react";
import BillCalendar from "../components/calendar/BillCalendar";
import AddBillModal from "../components/modals/AddBillModal";
import BillReminderPopup from "../components/BillReminderPopup";
import { getAllBills } from "../services/api";

export default function AutomatedBill() {
  const [bills, setBills] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeBill, setActiveBill] = useState(null);

  // Load bills from backend
  const fetchBills = async () => {
    try {
      const data = await getAllBills();
      setBills(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Map bills to calendar events
  const events = bills.map((bill) => ({
    title: `₹${bill.amount} - ${bill.title}`,
    date: bill.dueDate,
    extendedProps: { bill },
    color: bill.status === "paid" ? "#16a34a" : "#22c55e" // Tailwind greens
  }));

  // Background reminder popup
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      bills.forEach((bill) => {
        const due = new Date(bill.dueDate);
        if (
          bill.status === "pending" &&
          !bill.reminderSent &&
          now >= due
        ) {
          setActiveBill(bill);
        }
      });
    }, 60000); // check every 1 min

    return () => clearInterval(interval);
  }, [bills]);

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setShowAddModal(true);
  };

  const handleBillAdded = (bill) => {
    setBills((prev) => [...prev, bill]);
  };

  const handleClosePopup = () => {
    setActiveBill(null);
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-6">📅 Bill Calendar</h1>
      <BillCalendar
        events={events}
        onDateClick={handleDateClick}
        onEventClick={(bill) => setActiveBill(bill)}
      />
      <AddBillModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBillAdded={handleBillAdded}
        selectedDate={selectedDate}
      />
      <BillReminderPopup bill={activeBill} onClose={handleClosePopup} />
    </div>
  );
}
