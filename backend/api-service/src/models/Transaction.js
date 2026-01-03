const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  walletId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'wallet_id',
    references: {
      model: 'wallets',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  type: {
    type: DataTypes.ENUM('deposit', 'withdrawal', 'bet', 'win', 'refund', 'bonus', 'adjustment'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    get() {
      const value = this.getDataValue('amount');
      return value ? parseFloat(value) : 0;
    },
  },
  balanceBefore: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    field: 'balance_before',
    get() {
      const value = this.getDataValue('balanceBefore');
      return value ? parseFloat(value) : 0;
    },
  },
  balanceAfter: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    field: 'balance_after',
    get() {
      const value = this.getDataValue('balanceAfter');
      return value ? parseFloat(value) : 0;
    },
  },
  referenceId: {
    type: DataTypes.CHAR(36),
    field: 'reference_id',
  },
  referenceType: {
    type: DataTypes.STRING(50),
    field: 'reference_type',
  },
  description: {
    type: DataTypes.STRING(500),
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'completed',
  },
  idempotencyKey: {
    type: DataTypes.STRING(100),
    unique: true,
    field: 'idempotency_key',
  },
  metadata: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'transactions',
  timestamps: true,
  created_at: 'created_at',
  updatedAt: false,
});

module.exports = Transaction;
