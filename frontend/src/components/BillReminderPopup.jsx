import { motion } from "framer-motion";

export default function BillReminderPopup({ bill, onClose }) {
  if (!bill) return null;

  return (
    <motion.div
      className="fixed top-4 right-4 bg-green-600 text-white rounded-lg shadow-lg p-4 z-50 w-80"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{bill.title}</h3>
          <p>Amount: ₹{bill.amount}</p>
          <p>Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
        </div>
        <button onClick={onClose} className="font-bold ml-2">✖</button>
      </div>
    </motion.div>
  );
}
