

import React, { useState } from 'react';
import axios from 'axios';
import './AdminRideFilter.css';

const AdminRideFilter = () => {
  const [filterType, setFilterType] = useState('status');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRide, setSelectedRide] = useState(null);

  const handleFilter = async () => {
    try {
      setLoading(true);
      setError(null);
      let params = {};
      if (filterType === 'status' && status) params.status = status;
      if (filterType === 'date' && date) {
        params.startDate = date + 'T00:00:00.000Z';
        params.endDate = date + 'T23:59:59.999Z';
      }
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/admin/filter', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setRides(res.data.rides || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setStatus('');
    setDate('');
    setRides([]);
    setError(null);
  };

  return (
    <div className="admin-ride-filter">
      <div className="filter-header">
        <h1>🚗 Ride Management</h1>
        <p>Filter and manage ride requests</p>
      </div>
      
      <div className="filter-controls">
        <div className="filter-type-group">
          <button
            className={`filter-tab ${filterType === 'status' ? 'active' : ''}`}
            onClick={() => setFilterType('status')}
          >
            Filter by Status
          </button>
          <button
            className={`filter-tab ${filterType === 'date' ? 'active' : ''}`}
            onClick={() => setFilterType('date')}
          >
            Filter by Date
          </button>
        </div>

        <div className="filter-input-container">
          {filterType === 'status' && (
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
          {filterType === 'date' && (
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="filter-date"
            />
          )}
          <div className="button-group">
            <button 
              onClick={handleFilter} 
              className="filter-btn apply-btn"
              disabled={loading}
            >
              {loading ? 'Filtering...' : 'Apply Filter'}
            </button>
            <button 
              onClick={resetFilters} 
              className="filter-btn reset-btn"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="rides-container">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading rides...</p>
          </div>
        ) : rides.length > 0 ? (
          <div className="rides-table">
            <div className="table-header">
              <div>Status</div>
              <div>User</div>
              <div>Route</div>
              <div>Date & Time</div>
              <div>Actions</div>
            </div>
            {rides.map(ride => (
              <div key={ride._id} className="ride-row">
                <div>
                  <span className={`status-badge status-${ride.status}`}>
                    {ride.status.toUpperCase()}
                  </span>
                </div>
                <div>{ride.user?.name || 'Unknown'}</div>
                <div>
                  <span className="route">
                    {ride.pickup} → {ride.dropoff}
                  </span>
                </div>
                <div>{new Date(ride.createdAt).toLocaleString()}</div>
                <div>
                  <button
                    className="action-btn view"
                    onClick={() => setSelectedRide(ride)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-rides">
            🚗
            <h3>No rides found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>

      {/* Modal for ride details */}
      {selectedRide && (
        <div className="ride-modal-overlay" onClick={() => setSelectedRide(null)}>
          <div className="ride-modal" onClick={e => e.stopPropagation()}>
            <h2>Ride Details</h2>
            <p><strong>Status:</strong> {selectedRide.status}</p>
            <p><strong>User:</strong> {selectedRide.user?.name || 'Unknown'}</p>
            <p><strong>Pickup:</strong> {selectedRide.pickup}</p>
            <p><strong>Dropoff:</strong> {selectedRide.dropoff}</p>
            <p><strong>Date & Time:</strong> {new Date(selectedRide.createdAt).toLocaleString()}</p>
            <button className="filter-btn" onClick={() => setSelectedRide(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRideFilter;
