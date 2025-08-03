import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeBar, setActiveBar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    const fetchAnalytics = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Unauthorized. Please login as admin.');
        navigate('/admin/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/admin/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(res.data.analytics || {});
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Unauthorized. Please login as admin.');
          navigate('/admin/login');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch analytics');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const dailyAnalytics = analytics.ridesByDate || [];
  const totalRides = analytics.totalRides || 0;
  const completedRides = analytics.completedRides || 0;
  const cancelledRides = analytics.cancelledRides || 0;
  const approvedRides = analytics.approvedRides || 0; // Admin-approved rides
  const totalRevenue = analytics.totalRevenue || 0;
  const averageFare = analytics.averageFare || 0;
  const busiest = dailyAnalytics.reduce((max, a) => a.count > max.count ? a : max, { count: 0 });
  const maxCount = Math.max(...dailyAnalytics.map(a => a.count), 1);

  // Calculate additional metrics
  const completionRate = totalRides > 0 ? ((completedRides / totalRides) * 100).toFixed(1) : 0;
  const cancellationRate = totalRides > 0 ? ((cancelledRides / totalRides) * 100).toFixed(1) : 0;
  const rejectedRate = totalRides > 0 ? (((totalRides - completedRides - cancelledRides) / totalRides) * 100).toFixed(1) : 0;
  const acceptedRate = totalRides > 0 ? ((approvedRides / totalRides) * 100).toFixed(1) : 0; // Approved rate calculation

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value}%`;
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2 className="analytics-title">
          <span className="title-rapido">Rapido</span> Ride Analytics
        </h2>
        <div className="analytics-subtitle">Performance dashboard</div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading analytics...</div>
        </div>
      ) : (
        <div className="analytics-tab-content">
          <div className="analytics-summary">
            <div className="analytics-summary-item">
              <div className="analytics-summary-value">{totalRides}</div>
              <div className="analytics-summary-label">Total Rides</div>
              <div className="summary-sparkle">🚗</div>
            </div>
            
            <div className="analytics-summary-item">
              <div className="analytics-summary-value">{cancelledRides}</div>
              <div className="analytics-summary-label">Cancelled Rides</div>
              <div className="summary-sparkle">❌</div>
            </div>
          </div>

          <div className="analytics-highlights">
            <div className="highlight-card">
              <div className="highlight-content">
                <div className="highlight-value">{formatPercentage(cancellationRate)}</div>
                <div className="highlight-label">Cancellation Rate</div>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-content">
                <div className="highlight-value">{formatPercentage(rejectedRate)}</div>
                <div className="highlight-label">Rejected Rate</div>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-content">
                <div className="highlight-value">{formatPercentage(acceptedRate)}</div>
                <div className="highlight-label">Accepted Rate</div>
              </div>
            </div>

            <div className="highlight-card">
              <div className="highlight-content">
                <div className="highlight-value">{busiest._id || 'N/A'}</div>
                <div className="highlight-label">Busiest Day</div>
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="chart-header">
              <h3 className="chart-title">Daily Ride Performance</h3>
            </div>
            <div className="analytics-bar-chart">
              {dailyAnalytics.map((item, idx) => (
                <div 
                  key={item._id} 
                  className={`analytics-bar-item ${activeBar === idx ? 'active' : ''}`}
                  onMouseEnter={() => setActiveBar(idx)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  <div
                    className="analytics-bar"
                    style={{
                      height: `${(item.count / maxCount) * 260}px`,
                    }}
                  >
                    <div className="analytics-bar-tooltip">
                      <div className="tooltip-date">{item._id}</div>
                      <div className="tooltip-value">{item.count} rides</div>
                    </div>
                  </div>
                  <div className="analytics-bar-date">{item._id?.slice(5)}</div>
                  <div className="analytics-bar-count">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnalytics;