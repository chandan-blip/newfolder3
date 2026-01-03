const User = require('./User');
const RefreshToken = require('./RefreshToken');
const Wallet = require('./Wallet');
const Transaction = require('./Transaction');
const Game = require('./Game');
const Bet = require('./Bet');
const AuditLog = require('./AuditLog');

// Define associations
User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Wallet.hasMany(Transaction, { foreignKey: 'walletId', as: 'transactions' });
Transaction.belongsTo(Wallet, { foreignKey: 'walletId', as: 'wallet' });

User.hasMany(Bet, { foreignKey: 'userId', as: 'bets' });
Bet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Game.hasMany(Bet, { foreignKey: 'gameId', as: 'bets' });
Bet.belongsTo(Game, { foreignKey: 'gameId', as: 'game' });

module.exports = {
  User,
  RefreshToken,
  Wallet,
  Transaction,
  Game,
  Bet,
  AuditLog,
};
