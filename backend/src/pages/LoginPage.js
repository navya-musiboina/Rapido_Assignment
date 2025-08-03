import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: false, password: false });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  // Check if user just registered
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      toast.success('Registration successful! Please login with your credentials.', {
        position: "top-center",
        autoClose: 5000
      });
      
      // Pre-fill email if available
      if (location.state.email) {
        setForm(prev => ({ ...prev, email: location.state.email }));
      }
    }
  }, [location.state]);

  const validateForm = () => {
    const newErrors = {
      email: !form.email,
      password: !form.password
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      
      // Store token and user data in context
      login(res.data.user, res.data.token);
      
      toast.success('Login successful! Redirecting...', {
        onClose: () => {
          navigate('/dashboard');
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background-overlay"></div>
      <div className="background-image"></div>
      
      <div className="auth-container">
        <div className="logo-header">
          <img src="/assets/bike.png" />
          <h2>Rapido</h2>
        </div>
        
        <h3 className="welcome-text">
          {location.state?.registrationSuccess ? 'Welcome to Rapido!' : 'Welcome Back!'}
        </h3>
        <p className="sub-text">
          {location.state?.registrationSuccess 
            ? 'Your account has been created successfully. Please login to continue.' 
            : 'Login to continue your journey'
          }
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              value={form.email}
            />
            {errors.email && <span className="error-message">Email is required</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className={`form-input ${errors.password ? 'error' : ''}`}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              value={form.password}
            />
            {errors.password && <span className="error-message">Password is required</span>}
          </div>
          
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="footer-links">
            <a href="/forgot-password">Forgot Password?</a>
            <span className="divider">|</span>
            <a href="/register">Create Account</a>
          </div>
        </form>
      </div>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default LoginPage;