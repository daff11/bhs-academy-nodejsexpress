//User_Progress.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig.js');

const UserProgress = sequelize.define('UserProgress', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_user: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  id_program: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  id_chapter: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completed_at: {
    type: DataTypes.DATE,
    defaultValue: null,
  }
}, {
  tableName: 'user_progress',
  timestamps: false
});

UserProgress.associate = (models) => {
    UserProgress.belongsTo(models.User, {  // Nama tetap "User"
      foreignKey: 'id_user',
      as: 'User',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    UserProgress.belongsTo(models.Program, {  // Nama tetap "Program"
      foreignKey: 'id_program',
      as: 'Program',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  
    UserProgress.belongsTo(models.Chapters, {
      foreignKey: 'id_chapter',
      as: 'Chapter',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
};
  

module.exports = UserProgress;
