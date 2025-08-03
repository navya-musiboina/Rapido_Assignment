import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAllRides.css'; // Link to the new CSS file

const AdminAllRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        setError('');
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/admin/all-rides', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRides(res.data.rides || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load rides');
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleViewDetails = (rideId) => {
    navigate(`/admin/rides/${rideId}`);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="rides-header">
        <h2>All Ride Details</h2>
        <button onClick={handleBackToDashboard} className="back-btn">
          Back to Dashboard
        </button>
      </div>
      {loading ? (
        <div className="loading">Loading rides...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : rides.length === 0 ? (
        <div className="no-rides">No rides found</div>
      ) : (
        <>
          <div className="rides-summary">
            <div className="summary-item">
              <strong>Total Rides:</strong> {rides.length}
            </div>
            <div className="summary-item">
              <strong>Requested:</strong> {rides.filter((r) => r.status === 'requested').length}
            </div>
            <div className="summary-item">
              <strong>Approved:</strong> {rides.filter((r) => r.status === 'approved').length}
            </div>
            <div className="summary-item">
              <strong>Rejected:</strong> {rides.filter((r) => r.status === 'rejected').length}
            </div>
            <div className="summary-item">
              <strong>Cancelled:</strong> {rides.filter((r) => r.status === 'cancelled').length}
            </div>
          </div>
          <div className="rides-list">
            {rides.map((ride) => (
              <div key={ride._id} className="ride-item">
                <div className="ride-header">
                  <h3>Ride #{ride._id.slice(-6)}</h3>
                  <span className={`status-badge status-${ride.status}`}>
                    {ride.status.toUpperCase()}
                  </span>
                </div>
                <div className="ride-details">
                  <div className="detail-row">
                    <strong>User:</strong> {ride.user?.name || 'Unknown'} ({ride.user?.email || 'No email'})
                  </div>
                  <div className="detail-row">
                    <strong>Pickup:</strong> {ride.pickup}
                  </div>
                  <div className="detail-row">
                    <strong>Dropoff:</strong> {ride.dropoff}
                  </div>
                  <div className="detail-row">
                    <strong>Status:</strong>
                    <span className={`status-badge status-${ride.status}`}>
                      {ride.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <strong>Created:</strong> {new Date(ride.createdAt).toLocaleString()}
                  </div>
                  {ride.approvedAt && (
                    <div className="detail-row">
                      <strong>Processed:</strong> {new Date(ride.approvedAt).toLocaleString()}
                    </div>
                  )}
                  <div className="detail-row">
                    <button
                      className="view-details-btn"
                      onClick={() => handleViewDetails(ride._id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminAllRides;