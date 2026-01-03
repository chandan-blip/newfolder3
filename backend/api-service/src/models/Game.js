const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Game = sequelize.define('Game', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM('slots', 'roulette', 'blackjack', 'dice', 'crash', 'poker', 'baccarat'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    field: 'thumbnail_url',
  },
  minBet: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0.10000000,
    field: 'min_bet',
    get() {
      const value = this.getDataValue('minBet');
      return value ? parseFloat(value) : 0;
    },
  },
  maxBet: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 10000.00000000,
    field: 'max_bet',
    get() {
      const value = this.getDataValue('maxBet');
      return value ? parseFloat(value) : 0;
    },
  },
  houseEdge: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0.0200,
    field: 'house_edge',
    get() {
      const value = this.getDataValue('houseEdge');
      return value ? parseFloat(value) : 0;
    },
  },
  rtp: {
    type: DataTypes.DECIMAL(5, 4),
    allowNull: false,
    defaultValue: 0.9800,
    get() {
      const value = this.getDataValue('rtp');
      return value ? parseFloat(value) : 0;
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured',
  },
  config: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'games',
  timestamps: true,
  created_at: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Game;
