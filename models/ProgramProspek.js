// models/ProgramProspek.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const ProgramProspek = sequelize.define('ProgramProspek', {
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
    id_prospek: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
            model: 'prospek', 
            key: 'id'
        },
        field: 'id_prospek'
    },
}, {
    tableName: 'program_prospek',
    timestamps: true
});

// Ekspor model
module.exports = ProgramProspek;
