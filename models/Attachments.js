//Attachments.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const Attachments = sequelize.define('Attachments', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_chapter: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  file_path: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'attachments',
  timestamps: true
});

Attachments.associate = (models) => {
  Attachments.belongsTo(models.Chapters, {
    foreignKey: 'id_chapter',
    as: 'Chapter',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
};

module.exports = Attachments;
