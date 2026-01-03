const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bet = sequelize.define('Bet', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  gameId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    field: 'game_id',
    references: {
      model: 'games',
      key: 'id',
    },
  },
  roundId: {
    type: DataTypes.CHAR(36),
    field: 'round_id',
  },
  transactionId: {
    type: DataTypes.CHAR(36),
    field: 'transaction_id',
  },
  winTransactionId: {
    type: DataTypes.CHAR(36),
    field: 'win_transaction_id',
  },
  amount: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    get() {
      const value = this.getDataValue('amount');
      return value ? parseFloat(value) : 0;
    },
  },
  potentialWin: {
    type: DataTypes.DECIMAL(18, 8),
    field: 'potential_win',
    get() {
      const value = this.getDataValue('potentialWin');
      return value ? parseFloat(value) : 0;
    },
  },
  actualWin: {
    type: DataTypes.DECIMAL(18, 8),
    defaultValue: 0.00000000,
    field: 'actual_win',
    get() {
      const value = this.getDataValue('actualWin');
      return value ? parseFloat(value) : 0;
    },
  },
  multiplier: {
    type: DataTypes.DECIMAL(10, 4),
    get() {
      const value = this.getDataValue('multiplier');
      return value ? parseFloat(value) : null;
    },
  },
  betData: {
    type: DataTypes.JSON,
    field: 'bet_data',
  },
  resultData: {
    type: DataTypes.JSON,
    field: 'result_data',
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'won', 'lost', 'cancelled', 'refunded'),
    defaultValue: 'pending',
  },
  placedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'placed_at',
  },
  resolvedAt: {
    type: DataTypes.DATE,
    field: 'resolved_at',
  },
}, {
  tableName: 'bets',
  timestamps: false,
});

module.exports = Bet;
