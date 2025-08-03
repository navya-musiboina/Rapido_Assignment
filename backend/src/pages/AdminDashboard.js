import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css'; // Assuming you have a CSS file for styling
import axios from 'axios';

const AdminDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRides, setShowRides] = useState(false);
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  useEffect(() => {
    if (!token || !user) {
      navigate('/admin/login');
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
  }, [user, token, navigate]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await axios.get('http://localhost:5000/api/admin/all-rides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setRides(response.data.rides || []);
      } else {
        setError('Failed to fetch rides');
      }
    } catch (err) {
      setError(`Failed to load rides: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleShowRides = () => {
    setShowRides(true);
    fetchRides();
  };

  const handleBackToDashboard = () => {
    setShowRides(false);
    setRides([]);
    setError('');
  };

  const handleApprove = async (rideId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await axios.put(
        `http://localhost:5000/api/admin/ride/${rideId}/status`, 
        { status: 'approved' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride._id === rideId ? { ...ride, status: 'approved' } : ride
          )
        );
        setSuccess('Ride approved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to approve ride');
      }
    } catch (err) {
      setError(`Failed to approve ride: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (rideId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await axios.put(
        `http://localhost:5000/api/admin/ride/${rideId}/status`, 
        { status: 'rejected' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride._id === rideId ? { ...ride, status: 'rejected' } : ride
          )
        );
        setSuccess('Ride rejected successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to reject ride');
      }
    } catch (err) {
      setError(`Failed to reject ride: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rideId) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await axios.put(
        `http://localhost:5000/api/admin/ride/${rideId}/status`, 
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride._id === rideId ? { ...ride, status: 'cancelled' } : ride
          )
        );
        setSuccess('Ride cancelled successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to cancel ride');
      }
    } catch (err) {
      setError(`Failed to cancel ride: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-dashboard-container">
      {!showRides ? (
        <div className="dashboard-main">
          <div className="dashboard-welcome">
            <h2>Welcome to Admin Dashboard</h2>
            <p>Click the button below to view all ride details</p>
          </div>
          
          <div className="dashboard-actions">
            <button 
              onClick={handleShowRides}
              className="view-rides-btn"
            >
              All Ride Details
            </button>
            <button
              onClick={() => navigate('/admin/analytics')}
              className="view-analytics-btn"
              style={{ marginLeft: '10px' }}
            >
              Admin Analytics
            </button>
            <button
              onClick={() => navigate('/admin/filter')}
              className="view-filter-btn"
              style={{ marginLeft: '10px' }}
            >
              Admin Ride Filter
            </button>
          </div>
        </div>
      ) : (
        <div className="rides-section">
          <div className="rides-header">
            <h2>All Ride Details</h2>
            <button 
              onClick={handleBackToDashboard}
              className="back-btn"
            >
              Back to Dashboard
            </button>
          </div>
          
          {loading ? (
            <div className="loading">Loading rides...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : success ? (
            <div className="success-message">{success}</div>
          ) : rides.length === 0 ? (
            <div className="no-rides">No rides found</div>
          ) : (
            <>
              <div className="rides-summary">
                <div className="summary-item">
                  <strong>Total Rides:</strong> {rides.length}
                </div>
                <div className="summary-item">
                  <strong>Requested:</strong> {rides.filter(r => r.status === 'requested').length}
                </div>
                <div className="summary-item">
                  <strong>Approved:</strong> {rides.filter(r => r.status === 'approved').length}
                </div>
                <div className="summary-item">
                  <strong>Rejected:</strong> {rides.filter(r => r.status === 'rejected').length}
                </div>
                <div className="summary-item">
                  <strong>Cancelled:</strong> {rides.filter(r => r.status === 'cancelled').length}
                </div>
              </div>
              
              <div className="rides-table-container">
                <table className="rides-table">
                  <thead>
                    <tr>
                      <th>Ride ID</th>
                      <th>User</th>
                      <th>Pickup</th>
                      <th>Dropoff</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rides.map((ride) => (
                      <tr key={ride._id} className="ride-row">
                        <td>#{ride._id.slice(-6)}</td>
                        <td>{ride.user?.name || 'Unknown'}</td>
                        <td>{ride.pickup}</td>
                        <td>{ride.dropoff}</td>
                        <td>
                          <span className={`status-badge status-${ride.status}`}>
                            {ride.status.toUpperCase()}
                          </span>
                        </td>
                        <td>{new Date(ride.createdAt).toLocaleString()}</td>
                        <td className="ride-actions">
                          {ride.status === 'requested' && (
                            <>
                              <button className="approve-btn" onClick={() => handleApprove(ride._id)}>
                                Approve
                              </button>
                              <button className="reject-btn" onClick={() => handleReject(ride._id)}>
                                Reject
                              </button>
                            </>
                          )}
                          {ride.status === 'approved' && (
                            <button className="reject-btn" onClick={() => handleCancel(ride._id)}>
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;