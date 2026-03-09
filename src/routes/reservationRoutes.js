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