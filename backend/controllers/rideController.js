const Ride = require('../models/Ride');

exports.createRide = async (req, res) => {
  try {
    const { pickup, dropoff } = req.body;
    
    // Validate input
    if (!pickup || !dropoff) {
      return res.status(400).json({ message: 'Pickup and dropoff locations are required' });
    }

    const ride = new Ride({
      user: req.user._id,
      pickup,
      dropoff,
      status: 'requested',
    });

    await ride.save();
    
    res.status(201).json({
      message: 'Ride created successfully',
      ride: {
        id: ride._id,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
        status: ride.status,
        createdAt: ride.createdAt
      }
    });
  } catch (err) {
    console.error('Ride creation error:', err);
    res.status(500).json({ message: 'Server error while creating ride' });
  }
};

// Get all rides of a user
exports.getUserRides = async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ rides });
  } catch (err) {
    console.error('Get user rides error:', err);
    res.status(500).json({ message: 'Error fetching rides' });
  }
};

// Get ride details
exports.getRide = async (req, res) => {
  try {
    let ride;
    
    // If admin, allow access to any ride
    if (req.user.role === 'admin') {
      ride = await Ride.findById(req.params.id).populate('user', 'name email');
    } else {
      // Regular users can only access their own rides
      ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
    }
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.json({ ride });
  } catch (err) {
    console.error('Get ride error:', err);
    res.status(500).json({ message: 'Error fetching ride' });
  }
};

// Cancel the ride
exports.cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.status === 'cancelled') {
      return res.status(400).json({ message: 'Ride is already cancelled' });
    }

    if (ride.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed ride' });
    }

    ride.status = 'cancelled';
    await ride.save();

    res.json({ 
      message: 'Ride cancelled successfully',
      ride 
    });
  } catch (err) {
    console.error('Cancel ride error:', err);
    res.status(500).json({ message: 'Error cancelling ride' });
  }
};