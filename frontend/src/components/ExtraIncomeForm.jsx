import { useState } from "react";
import axios from "axios";

const ExtraIncomeForm = ({ refresh }) => {
  const [amount, setAmount] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/savings/extra-income",
        { amount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAmount("");
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding extra income");
    }
  };

  return (
    <form onSubmit={handleAdd}>
      <h3>Extra Income</h3>

      <input
        type="number"
        placeholder="Bonus / Gift / Freelance"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <button type="submit">Add Income</button>
    </form>
  );
};

export default ExtraIncomeForm;