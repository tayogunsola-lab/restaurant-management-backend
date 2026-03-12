/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Get all reservations (Admin)
 *     description: Admin can view all reservations with customer info.
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "List of all reservations"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reservations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       tableNumber:
 *                         type: integer
 *                         example: 5
 *                       dateTime:
 *                         type: string
 *                         example: "2026-03-15T19:00:00"
 *                       status:
 *                         type: string
 *                         example: Approved
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           name:
 *                             type: string
 *                             example: tee sax
 *                           email:
 *                             type: string
 *                             example: tee@email.com
 */


/**
 * @swagger
 * /api/reservations/{id}/status:
 *   put:
 *     summary: Update reservation status (Admin)
 *     description: Admin can approve or decline a reservation. Sends email to customer after status change.
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Declined]
 *                 example: Approved
 *     responses:
 *       200:
 *         description: "Reservation status updated"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reservation status updated
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: Approved
 *       400:
 *         description: "Invalid status"
 *       404:
 *         description: "Reservation not found"
 *       403:
 *         description: "Forbidden: insufficient role"
 */


/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a reservation (Customer)
 *     description: Customer can create a reservation for a specific table and date/time.
 *     tags:
 *       - Reservations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableNumber:
 *                 type: integer
 *                 example: 5
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-03-15T19:00:00"
 *     responses:
 *       201:
 *         description: "Reservation created"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reservation created
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     tableNumber:
 *                       type: integer
 *                       example: 5
 *                     dateTime:
 *                       type: string
 *                       example: "2026-03-15T19:00:00"
 */




const express = require('express');
const { body } = require('express-validator');
const { createReservation, updateReservationStatus, getAllReservations } = require('../controllers/reservationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('tableNumber').isInt({ gt: 0 }).withMessage('Table number must be positive'),
    body('dateTime').notEmpty().withMessage('Date and time required')
  ],
  createReservation
);

router.put(
  '/:id/status',
  protect,
  authorizeRoles('Admin'),
  [body('status').isIn(['Approved', 'Declined']).withMessage('Invalid status')],
  updateReservationStatus
);

router.get(
  '/',
  protect,
  authorizeRoles('Admin'),
  getAllReservations
);

module.exports = router;