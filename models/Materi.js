// models/Materi.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Materi = sequelize.define('Materi', {
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
    tableName: 'materi',
    timestamps: true
});

// Mengatur asosiasi
Materi.associate = (models) => {
    Materi.belongsToMany(models.Program, {
        through: models.ProgramMateri,
        foreignKey: 'id_materi',
        otherKey: 'id_programs' 
    });
    console.log("Asosiasi Materi -> Program berhasil");
};

module.exports = Materi;
