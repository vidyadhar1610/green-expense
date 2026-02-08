import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      // store token
      localStorage.setItem('token', data.token);

      // navigate to main/dashboard
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);
      alert('Registration successful! Please login.');
      setIsRegister(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ width: '300px', margin: '100px auto' }}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      <form onSubmit={isRegister ? handleRegister : handleLogin}>
        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          onChange={handleChange}
        />

        {/* Register-only fields */}
        {isRegister && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              required
              onChange={handleChange}
            />
          </>
        )}

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />

        <button type="submit">
          {isRegister ? 'Register' : 'Enter'}
        </button>
      </form>

      <br />

      <button onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? 'Already have an account? Login'
          : 'New user? Register'}
      </button>
    </div>
  );
};

export default Login;


