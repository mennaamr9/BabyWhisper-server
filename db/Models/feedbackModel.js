const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const User = require('./userModel')

const Feedback = sequelize.define('Feedback', {

  feedback_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  comments: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // References User table
      key: 'user_id',
    },
  },
},
  {
    tableName: "Feedback",
    timestamps: true,
  }
);

module.exports = Feedback;





