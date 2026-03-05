// models/Notifications.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js'); // Gantilah dengan konfigurasi Sequelize Anda

const Notifications = sequelize.define('Notifications', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  id_user: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'users', 
      key: 'id',
    },
  },
  id_purchase: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'program_purchase', 
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'success', 'error'),
    defaultValue: 'info',
    allowNull: false,
  },
}, {
  tableName: 'notifications',
  timestamps: true, 
});

Notifications.associate = (models) => {
  Notifications.belongsTo(models.User, { foreignKey: 'id_user' }); // Hubungan ke Users
  Notifications.belongsTo(models.ProgramPurchase, { foreignKey: 'id_purchase', as: 'purchase'});
};

module.exports = Notifications;
