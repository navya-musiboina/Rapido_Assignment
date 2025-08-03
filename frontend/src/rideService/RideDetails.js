/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './RideDetails.css';

function RideDetails() {
  const { id, name } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/rides/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRide(res.data.ride);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to fetch ride details');
        setRide(null);
      }
    };
    if (id) fetchRide();
  }, [id]);

  return (
    <div className="ride-details-container">
      <div className="ride-details-card">
        <h2 className="ride-details-title">Ride Details</h2>
        {name && <p className="ride-user-name">User: {name}</p>}
        {ride ? (
          <div className="ride-details-content">
            <ul className="ride-info-list">
              <li><strong>Ride ID:</strong> {ride._id}</li>
              <li><strong>Pickup Location:</strong> {ride.pickup}</li>
              <li><strong>Drop Location:</strong> {ride.dropoff}</li>
              <li>
                <strong>Status:</strong>
                <span className={`status-badge status-${ride.status}`}>
                  {ride.status.toUpperCase()}
                </span>
              </li>
              <li><strong>Created At:</strong> {new Date(ride.createdAt).toLocaleString()}</li>
              {ride.updatedAt && (
                <li><strong>Last Updated:</strong> {new Date(ride.updatedAt).toLocaleString()}</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="no-ride-message">
            <p>No ride details found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RideDetails;


*/


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './RideDetails.css';

function RideDetails() {
  const { id, name } = useParams();
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/rides/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRide(res.data.ride);

        // Automatically update the status to "completed" after 20 minutes
        if (res.data.ride.status !== 'completed') {
          setTimeout(async () => {
            try {
              await axios.put(
                `http://localhost:5000/api/rides/${id}`,
                { status: 'completed' },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              setRide((prevRide) => ({ ...prevRide, status: 'completed' }));
              alert('Ride status updated to completed.');
            } catch (err) {
              console.error('Failed to update ride status:', err);
            }
          }, 20 * 60 * 1000); // 20 minutes in milliseconds
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to fetch ride details');
        setRide(null);
      }
    };

    if (id) fetchRide();
  }, [id]);

  return (
    <div className="ride-details-container">
      <div className="ride-details-card">
        <h2 className="ride-details-title">Ride Details</h2>
        {name && <p className="ride-user-name">User: {name}</p>}
        {ride ? (
          <div className="ride-details-content">
            <ul className="ride-info-list">
              <li><strong>Ride ID:</strong> {ride._id}</li>
              <li><strong>Pickup Location:</strong> {ride.pickup}</li>
              <li><strong>Drop Location:</strong> {ride.dropoff}</li>
              <li>
                <strong>Status:</strong>
                <span className={`status-badge status-${ride.status}`}>
                  {ride.status.toUpperCase()}
                </span>
              </li>
              <li><strong>Created At:</strong> {new Date(ride.createdAt).toLocaleString()}</li>
              {ride.updatedAt && (
                <li><strong>Last Updated:</strong> {new Date(ride.updatedAt).toLocaleString()}</li>
              )}
            </ul>
          </div>
        ) : (
          <div className="no-ride-message">
            <p>No ride details found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RideDetails;