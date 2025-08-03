import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    switch (currentPage) {
      case 'about':
        return (
          <div className="about-section">
            <h2>About Rapido</h2>
            <p>
              Rapido is India's largest bike taxi service, offering fast, affordable, and reliable rides. 
              Our mission is to make commuting hassle-free and accessible for everyone. With millions of users 
              and thousands of drivers, we are transforming urban mobility.
            </p>
            <p>
              Whether you need a quick ride to work, a late-night trip, or a convenient way to send parcels,
              Rapido has got you covered. Our app is designed to provide a seamless experience, from  
            </p>
            <p>
              booking a ride to tracking your driver in real-time. Join us in making transportation easier and
              more efficient for everyone.  
            </p>
             
            </div>
         // </div>
        );
      case 'contact':
        return (
          <div className="contact-section">
            <h2>Contact Us</h2>
            <form className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <button type="submit" className="btn yellow-btn">Submit</button>
            </form>
          </div>
        );
      default:
        return (
          <div className="hero-section">
            <h1>Bharat Moves On Rapido!</h1>
            <p>Fast, affordable and reliable rides at your fingertips.</p>
            <div className="button-group">
              <Link to="/register"><button className="btn yellow-btn">Register</button></Link>
              <Link to="/login"><button className="btn yellow-btn">Login</button></Link>
              <Link to="/admin/login"><button className="btn admin-btn">Admin Login</button></Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <span className="brand-name">rapido</span>
          </div>
          <nav className="nav-links">
            <button className="nav-link" onClick={() => setCurrentPage('home')}>Home</button>
            <button className="nav-link" onClick={() => setCurrentPage('about')}>About Us</button>
            <button className="nav-link" onClick={() => setCurrentPage('contact')}>Contact Us</button>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <h2 className="services-title">Our Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <div className="service-icon">🏍️</div>
              <span className="service-name">Bike</span>
            </div>
            <div className="service-item">
              <div className="service-icon">🚗</div>
              <span className="service-name">Auto</span>
            </div>
            <div className="service-item">
              <div className="service-icon">🚐</div>
              <span className="service-name">Auto Share</span>
            </div>
            <div className="service-item">
              <div className="service-icon">📦</div>
              <span className="service-name">Parcel</span>
            </div>
          </div>
          <p>&copy; 2025 Rapido. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;