const express = require('express');
const { body } = require('express-validator');
const { placeOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order (Customer)
 *     description: Customer can place an order with multiple items.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mealId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
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
 *                   example: Order placed successfully
 *                 orderId:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Invalid request (e.g., empty items)
 */








/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order (Customer)
 *     description: Customer can place an order. Sends email after delivery update (later). 
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mealId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: "Order placed successfully"
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
 *                   example: Order placed successfully
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: "Order items required"
 *       401:
 *         description: "Unauthorized"
 */

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('Order items required')
  ],
  placeOrder
);


/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (Staff/Admin)
 *     description: Retrieve all orders with items and customer info.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 5
 *                           name:
 *                             type: string
 *                             example: Tee sax
 *                           email:
 *                             type: string
 *                             example: tee@example.com
 *                       total:
 *                         type: number
 *                         example: 250
 *                       status:
 *                         type: string
 *                         example: Pending
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             meal:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 2
 *                                 name:
 *                                   type: string
 *                                   example: Burger
 *                             quantity:
 *                               type: integer
 *                               example: 2
 */

router.get(
  '/',
  protect,
  authorizeRoles('Staff','Admin'),
  getAllOrders
);

const statusValidator = [
  body('status').notEmpty().withMessage('Status is required')
];


/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status (Staff/Admin)
 *     description: Staff or Admin can update order status. Sends email if status is Delivered or Completed.
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Preparing, Delivered, Completed]
 *                 example: Delivered
 *     responses:
 *       200:
 *         description: Order status updated
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
 *                   example: Order status updated
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: Delivered
 *       400:
 *         description: "Invalid status"
 *       403:
 *         description: "Forbidden: insufficient role"
 *       404:
 *         description: "Order not found"
 */

router.put(
  '/:id/status',
  protect,
  authorizeRoles('Staff','Admin'),
  ...statusValidator,
  updateOrderStatus
);

module.exports = router;