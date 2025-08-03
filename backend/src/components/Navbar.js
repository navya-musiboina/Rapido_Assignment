import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    const confirmFirst = window.confirm('Are you sure you want to delete your account?');
    if (!confirmFirst) return;

    const confirmSecond = window.confirm('This action is irreversible. Confirm again to delete your account.');
    if (!confirmSecond) return;

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Unauthorized. Please login.');
        navigate('/login');
        return;
      }

      const response = await axios.delete('http://localhost:5000/api/user/delete', {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Account deleted successfully.');
      localStorage.removeItem('userToken');
      navigate('/login');
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <span className="brand-logo">Rapido</span>
        </Link>
        
        <div className="navbar-menu">
          {user ? (
            <>
              <div className="navbar-nav">
                <Link to="/" className="nav-link">Home</Link>
                
                {user.role === 'admin' ? (
                  // Admin Navigation
                  <>
                    <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
                    <Link to="/admin/analytics" className="nav-link">Analytics</Link>
                    <Link to="/admin/filter" className="nav-link">Ride Filters</Link>
                  </>
                ) : (
                  // Regular User Navigation
                  <>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  </>
                )}
              </div>
              
              <div className="user-section">
                <span className="user-welcome">
                  Welcome, <span className="user-name">{user.name || user.email}</span>
                </span>
                <button 
                  className={`nav-button ${user.role === 'admin' ? 'admin-button' : ''}`} 
                  onClick={handleLogout}
                >
                  {user.role === 'admin' ? 'Admin Logout' : 'Sign Out'}
                </button>
                
              </div>
            </>
          ) : (
            <>
              <div className="navbar-nav">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/login" className="nav-link">Sign In</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </div>
              
              <div className="user-section">
                <button 
                  className="nav-button admin-login-button" 
                  onClick={() => navigate('/admin/login')}
                >
                  Admin Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;