const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, verifyAdmin } = require('../Middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             role:
 *               type: string
 *     UpdateRideStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, confirmed, in-progress, completed, cancelled]
 *     FilterRidesRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, confirmed, in-progress, completed, cancelled]
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         minFare:
 *           type: number
 *         maxFare:
 *           type: number
 *     AnalyticsResponse:
 *       type: object
 *       properties:
 *         totalRides:
 *           type: number
 *         completedRides:
 *           type: number
 *         cancelledRides:
 *           type: number
 *         totalRevenue:
 *           type: number
 *         averageFare:
 *           type: number
 *         ridesByStatus:
 *           type: object
 *         ridesByDate:
 *           type: array
 *           items:
 *             type: object
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       400:
 *         description: Bad request - invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", adminController.adminLogin);

/**
 * @swagger
 * /api/admin/all-rides:
 *   get:
 *     summary: Get all rides (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all rides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rides:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ride'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - admin privileges required
 *       500:
 *         description: Internal server error
 */
router.get('/all-rides', auth, verifyAdmin, adminController.getAllRides);

/**
 * @swagger
 * /api/admin/ride/{id}/status:
 *   put:
 *     summary: Update ride status (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ride ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRideStatusRequest'
 *     responses:
 *       200:
 *         description: Ride status updated successfully
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
 *       403:
 *         description: Forbidden - admin privileges required
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
router.put('/ride/:id/status', auth, verifyAdmin, adminController.updateRideStatus);

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get ride analytics (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ride analytics data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsResponse'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - admin privileges required
 *       500:
 *         description: Internal server error
 */
router.get('/analytics', auth, verifyAdmin, adminController.getRideAnalytics);

/**
 * @swagger
 * /api/admin/filter:
 *   get:
 *     summary: Filter rides with various criteria (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, in-progress, completed, cancelled]
 *         description: Filter by ride status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering
 *       - in: query
 *         name: minFare
 *         schema:
 *           type: number
 *         description: Minimum fare filter
 *       - in: query
 *         name: maxFare
 *         schema:
 *           type: number
 *         description: Maximum fare filter
 *     responses:
 *       200:
 *         description: Filtered rides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rides:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ride'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - admin privileges required
 *       500:
 *         description: Internal server error
 */
router.get('/filter', auth, verifyAdmin, adminController.filterRides);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Admin dashboard (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       403:
 *         description: Forbidden - admin privileges required
 *       500:
 *         description: Internal server error
 */
router.get("/dashboard", auth, verifyAdmin, (req, res) => {
  res.json({ 
    message: "Welcome to admin dashboard!", 
    user: req.user 
  });
});

module.exports = router;