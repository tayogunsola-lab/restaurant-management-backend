const Meal = require('../models/Meal');
const Category = require('../models/Category');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const createMeal = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { name, price, categoryId } = req.body;
    const category = await Category.findByPk(categoryId);
    if (!category)
      return res.status(404).json({ success: false, message: 'Category not found' });

    const image = req.file ? req.file.filename : null;

    const meal = await Meal.create({ name, price, categoryId, image });
    res.status(201).json({ success: true, meal });
  } catch (error) {
    next(error);
  }
};

const getMeals = async (req, res, next) => {
  try {
    const meals = await Meal.findAll({
      include: { model: Category, as: 'category', attributes: ['id', 'name'] } // ✅ alias included
    });
    res.status(200).json({ success: true, meals });
  } catch (error) {
    next(error);
  }
};

const getMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findByPk(req.params.id, {
      include: { model: Category, as: 'category', attributes: ['id', 'name'] } // ✅ alias included
    });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });
    res.status(200).json({ success: true, meal });
  } catch (error) {
    next(error);
  }
};

const updateMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    const { name, price, categoryId } = req.body;
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
      meal.categoryId = categoryId;
    }

    meal.name = name ?? meal.name;
    meal.price = price ?? meal.price;

    if (req.file) {
      if (meal.image) {
        const oldPath = path.join(__dirname, '../uploads', meal.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      meal.image = req.file.filename;
    }

    await meal.save();
    res.status(200).json({ success: true, meal });
  } catch (error) {
    next(error);
  }
};

const deleteMeal = async (req, res, next) => {
  try {
    const meal = await Meal.findByPk(req.params.id);
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    if (meal.image) {
      const imgPath = path.join(__dirname, '../uploads', meal.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await meal.destroy();
    res.status(200).json({ success: true, message: 'Meal deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMeal, getMeals, getMeal, updateMeal, deleteMeal };