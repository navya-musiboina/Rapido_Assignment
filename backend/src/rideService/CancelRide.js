import React, { useState } from 'react';
import axios from 'axios';

function CancelRide() {
  const [rideId, setRideId] = useState('');
  const [response, setResponse] = useState(null);

  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `http://localhost:5000/api/rides/${rideId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResponse(res.data);
      alert('Ride cancelled successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel ride');
      setResponse(null);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <h2 style={{ textAlign: 'center' }}>Cancel Ride</h2>
        <form onSubmit={handleCancel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Ride ID"
            value={rideId}
            onChange={(e) => setRideId(e.target.value)}
            required
          />
          <button type="submit">Cancel Ride</button>
        </form>
        {response && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <h4>Ride Cancelled:</h4>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default CancelRide;