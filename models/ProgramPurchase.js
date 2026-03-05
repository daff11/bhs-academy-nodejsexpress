// models/ProgramPurchase.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js'); // Gantilah dengan konfigurasi Sequelize Anda

const ProgramPurchase = sequelize.define('ProgramPurchase', {
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
  id_program: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    references: {
      model: 'programs', 
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bank: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  va_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purchase_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deadline_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
  },
}, {
  tableName: 'program_purchases',
  timestamps: false, 
});

ProgramPurchase.associate = (models) => {
  ProgramPurchase.belongsTo(models.User, { foreignKey: 'id_user' }); // Hubungan ke Users
  ProgramPurchase.belongsTo(models.Program, { foreignKey: 'id_program' }); // Hubungan ke Programs
};

module.exports = ProgramPurchase;
