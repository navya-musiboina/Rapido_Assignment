import React from 'react';
import { Link } from 'react-router-dom';
import './DashBoard.css';

function Dashboard() {
  return (
    <div className="dashboard-bg">
      
      <div className="dashboard-card">
        <h2 className="dashboard-welcome">Welcome Back!</h2>
        <p className="dashboard-desc">Manage your rides and bookings easily.</p>
        <div className="dashboard-actions">
          <Link to="/create-ride" className="dashboard-btn">Book a Ride</Link>
          <Link to="/user-rides" className="dashboard-btn secondary">View My Rides</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;