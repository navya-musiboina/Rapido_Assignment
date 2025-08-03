import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setError(null);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmFirst = window.confirm('Are you sure you want to delete your account?');
    if (!confirmFirst) return;

    const confirmSecond = window.confirm('This action is irreversible. Confirm again to delete your account.');
    if (!confirmSecond) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/user/delete', {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Account deleted successfully.');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Account deletion error:', err);
      alert('Failed to delete account. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Welcome to Your Profile</h1>
        <p>Manage your account details below</p>
      </div>
      <div className="profile-content">
        <div className="profile-card">
          <h2>Profile Information</h2>
          <p><b>Name:</b> {profile.name}</p>
          <p><b>Email:</b> {profile.email}</p>
          <p><b>Phone Number:</b> {profile.phoneNumber || 'Not provided'}</p>
          <p><b>Employee ID:</b> {profile.employeeId || 'Not provided'}</p>
          <button onClick={handleDeleteAccount} className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;