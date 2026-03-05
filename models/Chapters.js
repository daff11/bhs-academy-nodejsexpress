//Chapters.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Chapters = sequelize.define('Chapters', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_programs: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  video_path: {
    type: DataTypes.STRING,
    defaultValue: null,
  }
}, {
  tableName: 'chapters',
  timestamps: true
});

Chapters.associate = (models) => {
    Chapters.belongsTo(models.Program, {
      foreignKey: 'id_programs',
      as: 'Program',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    Chapters.hasMany(models.Attachments, {
      foreignKey: 'id_chapter',
      as: 'Attachments',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    Chapters.hasMany(models.UserProgress, {
      foreignKey: 'id_chapter',
      as: 'Progress',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
};

module.exports = Chapters;
