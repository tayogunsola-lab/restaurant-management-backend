const Review = require('../models/Review');
const Meal = require('../models/Meal');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');

const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { mealId, rating, comment } = req.body;

    const meal = await Meal.findByPk(mealId);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    const review = await Review.create({
      customerId: req.user.id,
      mealId,
      rating,
      comment,
      status: 'Pending'
    });

    res.status(201).json({ success: true, message: 'Review submitted', review });
  } catch (error) {
    next(error);
  }
};

const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Declined'].includes(status))
      return res.status(400).json({ success: false, message: 'Status must be Approved or Declined' });

    const review = await Review.findByPk(req.params.id, {
      include: { model: User, as: 'customer', attributes: ['name', 'email'] }
    });

    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.status = status;
    await review.save();

    await sendEmail(
      review.customer.email,
      `Your review has been ${status}`,
      `Hello ${review.customer.name},\n\nYour review for meal #${review.mealId} has been ${status}.`
    );

    res.status(200).json({ success: true, message: 'Review status updated', review });
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  try {
    const filter = req.query.mealId ? { mealId: req.query.mealId } : {};

    const reviews = await Review.findAll({
      where: filter,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name'] },
        { model: Meal, as: 'meal', attributes: ['id', 'name'] }
      ]
    });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReview, updateReviewStatus, getReviews };