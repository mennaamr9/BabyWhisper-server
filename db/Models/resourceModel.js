const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const User = require('./userModel')

  const Resource = sequelize.define('Resource', {
    resource_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    resource_type: {
      type: DataTypes.ENUM("article", "video"),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }

  },
  {
    tableName:"Resource",
    timestamps: true,
  });

  module.exports = Resource;
