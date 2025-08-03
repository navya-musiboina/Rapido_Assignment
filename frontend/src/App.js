import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard'; 
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CancelRide from './rideService/CancelRide';
import CreateRide from './rideService/CreateRide';
import RideDetails from './rideService/RideDetails';
import UserRides from './rideService/UserRides';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminRideFilter from './admin/AdminRideFilter';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar'; // Unified Navbar
import { AuthProvider, AuthContext } from './context/AuthContext'; // Context provider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const location = useLocation();
  const { user } = useContext(AuthContext); // Assuming AuthContext provides user info

  // Hide Navbar only on home, login, and register pages
  const hideNavbarPaths = ['/', '/login', '/register', '/admin/login'];
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="app">
      {shouldShowNavbar && <Navbar isUserLoggedIn={!!user} />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-ride" element={<CreateRide />} />
          <Route path="/ride-details" element={<RideDetails />} />
          <Route path="/cancel-ride" element={<CancelRide />} />
          <Route path="/user-rides" element={<UserRides />} />
          <Route path="/ride-details/:id" element={<RideDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/filter" element={<AdminRideFilter />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;