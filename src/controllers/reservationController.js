const Reservation = require('../models/Reservation');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService');

const createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { tableNumber, dateTime } = req.body;

    const reservation = await Reservation.create({
      customerId: req.user.id,
      tableNumber,
      dateTime
    });

    res.status(201).json({ success: true, message: 'Reservation created', reservation });
  } catch (error) {
    next(error);
  }
};

const updateReservationStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { status } = req.body;

    const reservation = await Reservation.findByPk(req.params.id, {
      include: { model: User, as: 'customer', attributes: ['name', 'email'] }
    });

    if (!reservation)
      return res.status(404).json({ success: false, message: 'Reservation not found' });

    reservation.status = status;
    await reservation.save();

    await sendEmail(
      reservation.customer.email,
      `Your reservation is ${reservation.status}`,
      `Hello ${reservation.customer.name},\n\nYour reservation for table ${reservation.tableNumber} on ${reservation.dateTime} has been ${reservation.status}.`
    );

    res.status(200).json({ success: true, message: 'Reservation status updated', reservation });
  } catch (error) {
    next(error);
  }
};

const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.findAll({
      include: { model: User, as: 'customer', attributes: ['id', 'name', 'email'] }
    });

    res.status(200).json({ success: true, reservations });
  } catch (error) {
    next(error);
  }
};

module.exports = { createReservation, updateReservationStatus, getAllReservations };