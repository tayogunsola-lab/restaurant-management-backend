const express = require('express');
const { body } = require('express-validator');
const { placeOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();



router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Order items required')
  ],
  placeOrder
);




router.get(
  '/',
  protect,
  authorizeRoles('Staff','Admin'),
  getAllOrders
);

const statusValidator = [
  body('status').notEmpty().withMessage('Status is required')
];




router.put(
  '/:id/status',
  protect,
  authorizeRoles('Staff','Admin'),
  ...statusValidator,
  updateOrderStatus
);

module.exports = router;