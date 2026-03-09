const express = require('express');
const { body } = require('express-validator');
const { createReview, updateReviewStatus, getReviews } = require('../controllers/reviewController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, [
  body('mealId').notEmpty().withMessage('Meal is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating 1-5 required')
], createReview);

router.put('/:id/status', protect, authorizeRoles('Admin'), [
  body('status').notEmpty().withMessage('Status required')
], updateReviewStatus);

router.get('/', getReviews);

module.exports = router;