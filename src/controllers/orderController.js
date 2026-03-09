const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Meal = require('../models/Meal');
const User = require('../models/User');
const { sequelize } = require('../config/mysql');
const { sendEmail } = require('../services/emailService');

const placeOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { items } = req.body;
    if (!items || !items.length)
      return res.status(400).json({ success: false, message: 'Order items required' });

    let total = 0;
    for (const item of items) {
      const meal = await Meal.findByPk(item.mealId, { transaction: t });
      if (!meal) throw new Error(`Meal not found: ${item.mealId}`);
      total += meal.price * item.quantity;
    }

    const order = await Order.create(
      {
        customerId: req.user.id,
        customerName: req.user.name,
        total,
      },
      { transaction: t }
    );

    for (const item of items) {
      await OrderItem.create(
        {
          orderId: order.id,
          mealId: item.mealId,
          quantity: item.quantity,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(201).json({ success: true, message: 'Order placed successfully', orderId: order.id });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: { model: Meal, as: 'meal' },
        },
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Preparing', 'Delivered', 'Completed'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });

    if (!['Admin', 'Staff'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role' });
    }

    const order = await Order.findByPk(req.params.id, {
      include: { model: User, as: 'customer', attributes: ['name', 'email'] },
    });

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    await order.save();

    if (['Delivered', 'Completed'].includes(status)) {
      if (order.customer && order.customer.email) {
        await sendEmail(
          order.customer.email,
          `Your order is ${status}`,
          `Hello ${order.customer.name},\n\nYour order #${order.id} has been ${status}. Enjoy your meal!`
        );
      }
    }

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getAllOrders, updateOrderStatus };