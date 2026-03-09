const Category = require('../models/Category');


const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const existing = await Category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ success: false, message: 'Category already exists' });

    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};


const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};


const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};


const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    const { name, description } = req.body;
    category.name = name ?? category.name;
    category.description = description ?? category.description;
    await category.save();

    res.status(200).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};


const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });

    await category.destroy();
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory };