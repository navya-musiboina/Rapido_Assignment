const jwt = require('jsonwebtoken');
const Ride = require('../models/Ride');

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get admin credentials from environment variables
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rapido.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if credentials match
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      {
        id: 'admin-id',
        email: ADMIN_EMAIL,
        role: 'admin',
        name: 'Admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: 'admin-id',
        name: 'Admin',
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin login failed',
      error: error.message
    });
  }
};

// Get all rides (for admin)
exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rides,
      count: rides.length
    });
  } catch (error) {
    console.error('Get all rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rides',
      error: error.message
    });
  }
};

// Update ride status
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required'
      });
    }

    const ride = await Ride.findByIdAndUpdate(
      id,
      {
        status,
        approvedAt: new Date()
      },
      { new: true }
    ).populate('user', 'name email');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.json({
      success: true,
      message: 'Ride status updated successfully',
      ride
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update status',
      error: error.message
    });
  }
};

// Get ride analytics
exports.getRideAnalytics = async (req, res) => {
  try {
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const cancelledRides = await Ride.countDocuments({ status: 'cancelled' });

    // Group by status
    const ridesByStatus = await Ride.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Group by date
    const ridesByDate = await Ride.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue and average fare
    const revenueStats = await Ride.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$fare" },
          averageFare: { $avg: "$fare" }
        }
      }
    ]);
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const averageFare = revenueStats[0]?.averageFare || 0;

    res.json({
      success: true,
      analytics: {
        totalRides,
        completedRides,
        cancelledRides,
        totalRevenue,
        averageFare,
        ridesByStatus,
        ridesByDate
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Filter rides
exports.filterRides = async (req, res) => {
  try {
    const { startDate, endDate, status, minFare, maxFare } = req.query;
    let filter = {};

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (status) filter.status = status;
    if (minFare) filter.fare = { ...filter.fare, $gte: Number(minFare) };
    if (maxFare) filter.fare = { ...filter.fare, $lte: Number(maxFare) };

    const rides = await Ride.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      rides,
      count: rides.length
    });
  } catch (error) {
    console.error('Filter rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to filter rides',
      error: error.message
    });
  }
};