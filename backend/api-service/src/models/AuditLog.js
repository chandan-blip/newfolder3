const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AuditLog = sequelize.define('AuditLog', {
  id: {
    type: DataTypes.CHAR(36),
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  userId: {
    type: DataTypes.CHAR(36),
    field: 'user_id',
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  entityType: {
    type: DataTypes.STRING(50),
    field: 'entity_type',
  },
  entityId: {
    type: DataTypes.CHAR(36),
    field: 'entity_id',
  },
  oldValues: {
    type: DataTypes.JSON,
    field: 'old_values',
  },
  newValues: {
    type: DataTypes.JSON,
    field: 'new_values',
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    field: 'ip_address',
  },
  userAgent: {
    type: DataTypes.STRING(500),
    field: 'user_agent',
  },
  metadata: {
    type: DataTypes.JSON,
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
  created_at: 'created_at',
  updatedAt: false,
});

module.exports = AuditLog;
