// models/Pengajar.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js'); // Pastikan ini mengimpor sequelize dengan benar

const Pengajar = sequelize.define("Pengajar", {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    gambar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jabatan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedin: {
        type: DataTypes.STRING,
        allowNull: true
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
    tableName: 'pengajar',
    timestamps: true
});

// Definisikan relasi
Pengajar.associate = (models) => {
    Pengajar.belongsToMany(models.Program, {
        through: "ProgramPengajar", // Mengarah ke model
        foreignKey: "id_pengajar",
        otherKey: "id_programs" 
    });
    console.log("Asosiasi Pengajar -> Program berhasil");
};

// Ekspor model
module.exports = Pengajar;
