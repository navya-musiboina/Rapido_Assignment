const express = require('express');
const router = express.Router();
const rideController = require('../controllers/rideController');
const { auth } = require('../Middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       required:
 *         - pickupLocation
 *         - dropLocation
 *         - fare
 *       properties:
 *         pickupLocation:
 *           type: string
 *           description: Pickup location address
 *         dropLocation:
 *           type: string
 *           description: Drop location address
 *         fare:
 *           type: number
 *           description: Ride fare in currency
 *         status:
 *           type: string
 *           enum: [pending, confirmed, in-progress, completed, cancelled]
 *           default: pending
 *         userId:
 *           type: string
 *           description: ID of the user who created the ride
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateRideRequest:
 *       type: object
 *       required:
 *         - pickupLocation
 *         - dropLocation
 *         - fare
 *       properties:
 *         pickupLocation:
 *           type: string
 *         dropLocation:
 *           type: string
 *         fare:
 *           type: number
 *     RideResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         ride:
 *           $ref: '#/components/schemas/Ride'
 *     RidesResponse:
 *       type: object
 *       properties:
 *         rides:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ride'
 */

/**
 * @swagger
 * /api/rides:
 *   post:
 *     summary: Create a new ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRideRequest'
 *     responses:
 *       201:
 *         description: Ride created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/', auth, rideController.createRide);

/**
 * @swagger
 * /api/rides:
 *   get:
 *     summary: Get all rides for the authenticated user
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's rides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RidesResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/', auth, rideController.getUserRides);

/**
 * @swagger
 * /api/rides/{id}:
 *   get:
 *     summary: Get a specific ride by ID
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RideResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', auth, rideController.getRide);

/**
 * @swagger
 * /api/rides/{id}/cancel:
 *   patch:
 *     summary: Cancel a ride
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     responses:
 *       200:
 *         description: Ride cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ride:
 *                   $ref: '#/components/schemas/Ride'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       404:
 *         description: Ride not found
 *       400:
 *         description: Ride cannot be cancelled
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/cancel', auth, rideController.cancelRide);

module.exports = router;