const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const auth = require('../middleware/auth');

router.post('/', auth, rideController.createRide);
router.get('/', auth, rideController.getUserRides);
router.get('/:id', auth, rideController.getRide);
router.patch('/:id/cancel', auth, rideController.cancelRide);

module.exports = router;