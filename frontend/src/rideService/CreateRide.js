import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './CreateRide.css';

function CreateRide() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pickup.trim() || !dropoff.trim()) {
      toast.error('Please provide both pickup and dropoff locations');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/rides',
        { pickup: pickup.trim(), dropoff: dropoff.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPickup('');
      setDropoff('');
      setIsSuccess(true);
      toast.success('Ride created successfully!');
      console.log('Ride created:', response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create ride';
      toast.error(errorMessage);
      console.error('Ride creation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="create-ride-container">
        <div className="create-ride-card">
          <h2 className="create-ride-title">Ride Created Successfully!</h2>
          <div style={{ textAlign: 'center', marginBottom: '20px', color: '#bfa600' }}>
            <p>Your ride has been created and is pending approval.</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setIsSuccess(false);
                setPickup('');
                setDropoff('');
              }}
              className="create-ride-btn"
            >
              Create Another Ride
            </button>
            <button
              onClick={() => navigate('/user-rides')}
              className="create-ride-btn"
              style={{ backgroundColor: '#28a745' }}
            >
              View All Rides
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-ride-container">
      <div className="create-ride-card">
        <h2 className="create-ride-title">Create New Ride</h2>
        <form onSubmit={handleSubmit} className="create-ride-form">
          <label className="create-ride-label" htmlFor="pickup">Pickup Location</label>
          <input
            id="pickup"
            type="text"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            required
            className="create-ride-input"
          />

          <label className="create-ride-label" htmlFor="dropoff">Dropoff Location</label>
          <input
            id="dropoff"
            type="text"
            placeholder="Enter dropoff location"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            required
            className="create-ride-input"
          />

          <button type="submit" disabled={isLoading} className="create-ride-btn">
            {isLoading ? 'Creating...' : 'Create Ride'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRide;
