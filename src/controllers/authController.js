const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailService');

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let { name, email, password, role } = req.body;
    role = role || 'Customer';

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(200).json({ success: true, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    await sendEmail(
      user.email,
      'Welcome to Restaurant App',
      `Hello ${user.name},\n\nThank you for registering at our Restaurant!`
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(200).json({ success: true, token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role'] });
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile };