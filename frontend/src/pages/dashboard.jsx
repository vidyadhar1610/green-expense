import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <h2>Financial Overview</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginTop: '30px'
        }}
      >
        <div className="card" onClick={() => navigate('/expenses')}>
          Expense Tracking & Categorization
        </div>
        <div className="card" onClick={() => navigate('/savings')}>
          Savings Goals Tracking
        </div>
        <div className="card" onClick={() => navigate('/debt')}>
          Debt Management Plan
        </div>
        <div className="card" onClick={() => navigate('/reminders')}>
          Automated Bill Reminders
        </div>
        <div className="card" onClick={() => navigate('/goals')}>
          Financial Goal Planning
        </div>
      </div>
    </>
  );
};

export default Dashboard;
