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

/**
 * @swagger
 * /api/meals:
 *   post:
 *     summary: Create a new meal
 *     description: Admin creates a meal with image upload
 *     tags:
 *       - Meals
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chicken Burger
 *               description:
 *                 type: string
 *                 example: Delicious grilled chicken burger
 *               price:
 *                 type: number
 *                 example: 12.5
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       401:
 *         description: Unauthorized
 */


router.post('/', protect, authorizeRoles('Admin'), upload.single('image'), [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('categoryId').notEmpty().withMessage('Category is required')
], createMeal);

/**
 * @swagger
 * /api/meals/{id}:
 *   put:
 *     summary: Update a meal by ID
 *     description: Update meal details. Admin only. Image upload optional.
 *     tags:
 *       - Meals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meal ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Coke Zero
 *               description:
 *                 type: string
 *                 example: Sugar-free soda
 *               price:
 *                 type: number
 *                 example: 2.5
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Meal updated successfully
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
 *                   example: Meal updated successfully
 *                 meal:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Coke Zero
 *                     description:
 *                       type: string
 *                       example: Sugar-free soda
 *                     price:
 *                       type: number
 *                       example: 2.5
 *                     image:
 *                       type: string
 *                       example: /uploads/cokezero.jpg
 *                     categoryId:
 *                       type: integer
 *                       example: 1
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Drinks
 *       404:
 *         description: Meal not found
 */

router.put('/:id', protect, authorizeRoles('Admin'), upload.single('image'), updateMeal);

/**
 * @swagger
 * /api/meals/{id}:
 *   delete:
 *     summary: Delete a meal by ID
 *     description: Remove a meal from the system. Admin only.
 *     tags:
 *       - Meals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal deleted successfully
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
 *                   example: Meal deleted successfully
 *       404:
 *         description: Meal not found
 */

router.delete('/:id', protect, authorizeRoles('Admin'), deleteMeal);

/**
 * @swagger
 * /api/meals:
 *   get:
 *     summary: Get all meals
 *     description: Retrieve all meals with category information
 *     tags:
 *       - Meals
 *     responses:
 *       200:
 *         description: List of meals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 meals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Coke
 *                       description:
 *                         type: string
 *                         example: Refreshing drink
 *                       price:
 *                         type: number
 *                         example: 2
 *                       image:
 *                         type: string
 *                         example: /uploads/coke.jpg
 *                       categoryId:
 *                         type: integer
 *                         example: 1
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           name:
 *                             type: string
 *                             example: Drinks
 */


router.get('/', getMeals);

/**
 * @swagger
 * /api/meals/{id}:
 *   get:
 *     summary: Get a single meal by ID
 *     description: Retrieve a meal along with its category information
 *     tags:
 *       - Meals
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 meal:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Coke
 *                     description:
 *                       type: string
 *                       example: Refreshing drink
 *                     price:
 *                       type: number
 *                       example: 2
 *                     image:
 *                       type: string
 *                       example: /uploads/coke.jpg
 *                     categoryId:
 *                       type: integer
 *                       example: 1
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Drinks
 *       404:
 *         description: Meal not found
 */

router.get('/:id', getMeal);

module.exports = router;