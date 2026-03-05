// models/ProgramPengajar.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const ProgramPengajar = sequelize.define('ProgramPengajar', {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    id_programs: { 
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'programs',
            key: 'id'
        },
        field: 'id_programs'
    },
    id_pengajar: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'pengajar', 
            key: 'id'
        },
        field: 'id_pengajar'
    },
}, {
    tableName: 'program_pengajar',
    timestamps: true
});

// Ekspor model
module.exports = ProgramPengajar;
