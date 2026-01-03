const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'casino_db',
  process.env.DB_USER || 'casino_user',
  process.env.DB_PASSWORD || 'casino_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }
);

const connectDatabase = async () => {
  await sequelize.authenticate();
  return true;
};

module.exports = { sequelize, connectDatabase };
