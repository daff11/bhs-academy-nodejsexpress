// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const User = sequelize.define('User',{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true, 
    }}, {
    tableName: 'users',
    timestamps: true
});

// Relasi: Seorang User bisa memiliki banyak ProgramPurchases
User.associate = (models) => {
    User.hasMany(models.ProgramPurchase, { foreignKey: 'id_program' });
  };

module.exports = User;
