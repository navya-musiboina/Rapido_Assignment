import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserRides.css';

function UserRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRides = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'http://localhost:5000/api/rides',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRides(res.data.rides);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch rides');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRides();
  }, []);

  const handleCancel = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRides();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ride');
    }
  };

  return (
    <div className="user-rides-container">
      <div className="user-rides-card">
        <h2 className="user-rides-title">Your Rides</h2>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#bfa600' }}>Loading...</p>
        ) : rides.length === 0 ? (
          <div className="user-rides-empty">
            <div className="user-rides-empty-title">No rides found.</div>
            <button
              className="user-rides-empty-btn"
              onClick={() => navigate('/create-ride')}
            >
              Book Your First Ride
            </button>
          </div>
        ) : (
          <ul className="user-rides-list">
            {rides.map(ride => (
              <li key={ride._id} className="user-ride-item">
                <div>
                  <span className="user-ride-label">Pickup:</span> {ride.pickup}
                </div>
                <div>
                  <span className="user-ride-label">Dropoff:</span> {ride.dropoff}
                </div>
                <div className="user-ride-status">
                  Status: {ride.status}
                </div>
                <div style={{ marginTop: '0.7rem' }}>
                  <button
                    className="user-ride-btn"
                    onClick={() => navigate(`/ride-details/${ride._id}`)}
                  >
                    Ride Details
                  </button>
                  {ride.status === 'requested' && (
                    <button
                      className="user-ride-btn cancel"
                      onClick={() => handleCancel(ride._id)}
                    >
                      Cancel
                    </button>
                  )}
                  {ride.status === 'rejected' && (
                    <span className="user-ride-rejected">
                      REJECTED BY ADMIN
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserRides;