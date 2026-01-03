const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    unique: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  balance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.00000000,
    get() {
      const value = this.getDataValue('balance');
      return value ? parseFloat(value) : 0;
    },
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD',
  },
  lockedBalance: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.00000000,
    field: 'locked_balance',
    get() {
      const value = this.getDataValue('lockedBalance');
      return value ? parseFloat(value) : 0;
    },
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'wallets',
  timestamps: true,
  created_at: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Wallet;
