const Ride = require('../models/Ride');

// Create a new ride request
exports.createRide = async (req, res) => {
  const { pickup, dropoff } = req.body;
  const ride = await Ride.create({
    user: req.user.id,
    pickup,
    dropoff
  });
  res.status(201).json(ride);
};

// Get all rides of a user
exports.getUserRides = async (req, res) => {
  const rides = await Ride.find({ user: req.user.id });
  res.json(rides);
};

// Get ride details
exports.getRide = async (req, res) => {
  const ride = await Ride.findOne({ _id: req.params.id, user: req.user.id });
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  res.json(ride);
};

// Cancel the ride
exports.cancelRide = async (req, res) => {
  const ride = await Ride.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { status: 'cancelled' },
    { new: true }
  );
  if (!ride) return res.status(404).json({ message: 'Ride not found' });
  res.json(ride);
};