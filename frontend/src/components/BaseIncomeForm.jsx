import { useState } from "react";
import axios from "axios";

const BaseIncomeForm = ({ refresh }) => {
  const [income, setIncome] = useState("");
  const [incomeType, setIncomeType] = useState("Monthly");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/savings/calculate",
        { income, incomeType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIncome("");
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving income");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Base Income</h3>

      <input
        type="number"
        placeholder="Enter income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        required
      />

      <select
        value={incomeType}
        onChange={(e) => setIncomeType(e.target.value)}
      >
        <option value="Monthly">Monthly</option>
        <option value="PocketMoney">Pocket Money</option>
        <option value="Yearly">Yearly</option>
        <option value="Scholarship">Scholarship</option>
      </select>

      <button type="submit">Save Income</button>
    </form>
  );
};

export default BaseIncomeForm;