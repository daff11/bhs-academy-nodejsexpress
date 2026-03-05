// models/Admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Admin = sequelize.define('Admin',{
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
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
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true
    }}, {
    tableName: 'admin',
    timestamps: true
});

module.exports = Admin;
