import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// LOGIN
export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  
  // store JWT token in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// REGISTER
export const registerUser = async (data) => {
  const response = await axios.post(`${API_URL}/register`, data);
  return response.data;
};

// PROTECTED ROUTES (example: get profile)
export const getUserProfile = async () => {
  const token = localStorage.getItem('token'); // read stored token

  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`, // send token to backend
    },
  });

  return response.data;
};

// ================= EXPENSE APIs =================

const EXPENSE_API = 'http://localhost:5000/api/expense';

// ADD EXPENSE
export const addExpense = async (data) => {
  const token = localStorage.getItem('token');

  const response = await axios.post(EXPENSE_API, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// GET USER EXPENSES
export const getExpenses = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(EXPENSE_API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// UPDATE EXPENSE
export const updateExpense = async (id, data) => {
  const token = localStorage.getItem('token');

  const response = await axios.patch(`${EXPENSE_API}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// DELETE EXPENSE
export const deleteExpense = async (id) => {
  const token = localStorage.getItem('token');

  const response = await axios.delete(`${EXPENSE_API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ================= SAVINGS APIs =================






const BASE_URL = "http://localhost:5000/api/savings";

// ============================
// CALCULATE MONTHLY SAVINGS
// ============================
export const calculateMonthlySavings = async (data) => {
  const token = localStorage.getItem("token");
  console.log(token);

  const response = await axios.post(
    `${BASE_URL}/calculate`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ============================
// GET CURRENT SAVINGS
// ============================
export const getCurrentSavings = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${BASE_URL}/current`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// ============================
// ADD EXTRA INCOME
// ============================
export const addExtraIncome = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${BASE_URL}/extra-income`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};






const BILL_URL = "http://localhost:5000/api/bills";

/**
 * Get all bills for the logged-in user
 */
export const getAllBills = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BILL_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Create a new bill
 * @param {Object} billData
 */
export const createBill = async (billData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BILL_URL}`, billData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Update an existing bill
 */
export const updateBill = async (id, billData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${BILL_URL}/${id}`, billData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Mark a bill as paid
 */
export const markBillPaid = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(`${BILL_URL}/${id}/pay`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/**
 * Delete a bill
 */
export const deleteBill = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${BILL_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


const DEBT_URL = "http://localhost:5000/api/debts";

/* ============================
   CREATE DEBT
============================ */
export const createDebt = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${DEBT_URL}`,   // ✅ removed /create
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


/* ============================
   GET ALL DEBTS
============================ */
export const getDebts = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${DEBT_URL}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

/* ============================
   DELETE DEBT
============================ */
export const deleteDebt = async (debtId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${DEBT_URL}/${debtId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};







