const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const { createMeal, getMeals, getMeal, updateMeal, deleteMeal } = require('../controllers/mealController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'src/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', protect, authorizeRoles('Admin'), upload.single('image'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('categoryId').notEmpty().withMessage('Category is required')
], createMeal);

router.put('/:id', protect, authorizeRoles('Admin'), upload.single('image'), updateMeal);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteMeal);

router.get('/', getMeals);
router.get('/:id', getMeal);

module.exports = router;