// models/Programs.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js'); // Pastikan ini mengimpor sequelize dengan benar

const Programs = sequelize.define('Programs', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: false,
    allowNull: false,
  },
  gambar: {
    type: DataTypes.STRING,
  },
  nama_program: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durasi: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  durasi_jamhari: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  harga: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  diskon: {
    type: DataTypes.DECIMAL,
    allowNull: true,
  },
  detail: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  tableName: 'programs',
  timestamps: true
});

Programs.associate = (models) => {
    Programs.belongsTo(models.Program_Type, {
        foreignKey: 'type',
        as: 'Type',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    
    Programs.belongsToMany(models.Materi, {
        through: models.ProgramMateri,
        foreignKey: 'id_programs',
        otherKey: 'id_materi',
        as: 'Materi',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Programs.belongsToMany(models.Prospek, {
        through: models.ProgramProspek,
        foreignKey: 'id_programs',
        otherKey: 'id_prospek',
        as: 'Prospek', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Programs.belongsToMany(models.Pengajar, {
        through: models.ProgramPengajar,
        foreignKey: 'id_programs',
        otherKey: 'id_pengajar',
        as: 'Pengajar', 
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

module.exports = Programs;
