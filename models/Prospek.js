// models/Prospek.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js'); // Pastikan ini mengimpor sequelize dengan benar

const Prospek = sequelize.define("Prospek", {
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
    tableName: 'prospek',
    timestamps: true
});

// Definisikan relasi
Prospek.associate = (models) => {
    Prospek.belongsToMany(models.Program, {
        through: "ProgramProspek", // Tabel pivot
        foreignKey: "id_prospek",
        otherKey: "id_programs" 
    });
    console.log("Asosiasi Prospek -> Program berhasil");
};

// Ekspor model
module.exports = Prospek;
