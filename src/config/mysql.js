const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    dialect: 'mysql',
    logging: process.env.SEQUELIZE_LOGGING === 'true',
    pool: { max: 10, min: 0, idle: 10000 }
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    throw new Error(`MySQL connection failed: ${error.message}`);
  }
};

module.exports = { sequelize, connectMySQL };