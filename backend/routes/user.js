const express = require('express');
const router = express.Router();
const { auth } = require('../Middleware/auth');
const User = require('../models/User');

// Fetch user profile
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Profile request from user:', req.user._id);
    
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      console.log('User not found in database:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Profile retrieved successfully for user:', user.email);
    res.json(user);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('Profile update request from user:', req.user._id);
    console.log('Update data:', req.body);
    
    const updates = req.body;
    
    // Only allow certain fields to be updated
    const allowedUpdates = ['name', 'phoneNumber', 'employeeId'];
    const filteredUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Check for unique employeeId if it's being updated
    if (filteredUpdates.employeeId) {
      const existingEmployeeId = await User.findOne({ 
        employeeId: filteredUpdates.employeeId,
        _id: { $ne: req.user._id } // Exclude current user
      });
      if (existingEmployeeId) {
        return res.status(400).json({ message: 'Employee ID already exists' });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      filteredUpdates, 
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('Profile updated successfully for user:', user.email);
    res.json(user);
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user account
router.delete('/delete', auth, async (req, res) => {
  try {
    console.log('Delete account request received.');
    console.log('Authenticated user ID:', req.user._id);

    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      console.log('User not found in database:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Account deleted successfully for user:', user.email);
    res.status(200).json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;