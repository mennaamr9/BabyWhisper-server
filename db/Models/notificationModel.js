const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const User = require('./userModel');



  const Notification = sequelize.define('Notification', {
    notification_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    age_in_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName:"Notification",
    timestamps: true,
  });

module.exports = Notification;



