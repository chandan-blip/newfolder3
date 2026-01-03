const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50],
      is: /^[a-zA-Z0-9_]+$/,
    },
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash',
  },
  firstName: {
    type: DataTypes.STRING(100),
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING(100),
    field: 'last_name',
  },
  avatarUrl: {
    type: DataTypes.STRING(500),
    field: 'avatar_url',
  },
  role: {
    type: DataTypes.ENUM('user', 'vip', 'admin'),
    defaultValue: 'user',
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'banned'),
    defaultValue: 'active',
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified',
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    field: 'last_login_at',
  },
  lastLoginIp: {
    type: DataTypes.STRING(45),
    field: 'last_login_ip',
  },
}, {
  tableName: 'users',
  timestamps: true,
  created_at: 'created_at',
  updatedAt: 'updated_at',
});

// Hash password before saving
User.beforeCreate(async (user) => {
  if (user.passwordHash) {
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed('passwordHash')) {
    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
  }
});

// Instance method to verify password
User.prototype.verifyPassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Instance method to get safe user data (without password)
User.prototype.toSafeObject = function() {
  return {
    id: this.id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    avatarUrl: this.avatarUrl,
    role: this.role,
    status: this.status,
    emailVerified: this.emailVerified,
    lastLoginAt: this.lastLoginAt,
    created_at: this.created_at,
  };
};

module.exports = User;
