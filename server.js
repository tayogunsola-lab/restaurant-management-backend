require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { connectMySQL } = require('./src/config/mysql');
const { connectMongoDB } = require('./src/config/mongodb');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const { logger } = require('./src/middleware/loggerMiddleware');


const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const mealRoutes = require('./src/routes/mealRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const reservationRoutes = require('./src/routes/reservationRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');


const User = require('./src/models/User');
const Category = require('./src/models/Category');
const Meal = require('./src/models/Meal');
const Order = require('./src/models/Order');
const OrderItem = require('./src/models/OrderItem');
const Reservation = require('./src/models/Reservation');
const Review = require('./src/models/Review');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

const uploadsDir = path.join(__dirname, 'src', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));


app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/reviews', reviewRoutes);


app.use(errorHandler);


Category.hasMany(Meal, { foreignKey: 'categoryId', as: 'categoryMeals' });
Meal.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
OrderItem.belongsTo(Meal, { foreignKey: 'mealId', as: 'meal' });

Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Reservation.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Review.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });

User.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
User.hasMany(Reservation, { foreignKey: 'customerId', as: 'reservations' });
User.hasMany(Review, { foreignKey: 'customerId', as: 'reviews' });

Review.belongsTo(Meal, { foreignKey: 'mealId', as: 'reviewMeal' });


const ensureTableExists = async (model) => { await model.sync(); };
const checkAllTables = async () => {
  const models = [User, Category, Meal, Order, OrderItem, Reservation, Review];
  for (const model of models) { await ensureTableExists(model); }
};

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectMySQL();
    await connectMongoDB();

    if (process.env.NODE_ENV !== 'production') {
      await checkAllTables();
    }

    await app.listen(PORT);
  } catch (error) {
    throw new Error(`Server startup failed: ${error.message}`);
  }
};

startServer();