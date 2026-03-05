// models/Program_Type.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Program_Type = sequelize.define('Program_Type', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'program_type',
    timestamps: false,
});

// Mengatur asosiasi
Program_Type.associate = (models) => {
    Program_Type.hasMany(models.Program, {
      foreignKey: 'type',
      as: 'Programs',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    console.log("Asosiasi Program_Type -> Coorporate berhasil");
  };


module.exports = Program_Type;
