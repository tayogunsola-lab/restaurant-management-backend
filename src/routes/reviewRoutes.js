const express = require('express');
const { body } = require('express-validator');
const { createReview, updateReviewStatus, getReviews } = require('../controllers/reviewController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Customer submits a review
 *     description: Customer can submit a review for a meal. Rating must be 1-5.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealId:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Great meal!"
 *     responses:
 *       201:
 *         description: Review submitted successfully
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
 *                   example: Review submitted
 *                 review:
 *                   type: object
 */

/**
 * @swagger
 * /api/reviews/{id}/status:
 *   put:
 *     summary: Admin approves or declines a review
 *     description: Only Admin can approve or decline reviews.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Review ID
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
 *         description: Review status updated successfully
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
 *                   example: Review status updated
 *                 review:
 *                   type: object
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get reviews (optionally filter by meal)
 *     description: Returns all reviews. Can filter by `mealId` query param.
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reviews:
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
 *                       meal:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: Burger
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: "Great meal!"
 *                       status:
 *                         type: string
 *                         example: Pending
 */

router.post('/', protect, [
  body('mealId').notEmpty().withMessage('Meal is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5 required')
], createReview);

router.put('/:id/status', protect, authorizeRoles('Admin'), [
  body('status').notEmpty().withMessage('Status required')
], updateReviewStatus);

router.get('/', getReviews);

module.exports = router;