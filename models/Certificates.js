//Certificates.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Certificates = sequelize.define('Certificates', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  id_program: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'issued'),
    defaultValue: 'pending',
    allowNull: false,
  },
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  cert_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
}, {
  tableName: 'certificates',
  timestamps: true
});

Certificates.associate = (models) => {
    Certificates.belongsTo(models.User, {  // Nama tetap "User"
      foreignKey: 'id_user',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    Certificates.belongsTo(models.Program, {  // Nama tetap "Program"
      foreignKey: 'id_program',
      as: 'Program',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
};

module.exports = Certificates;
