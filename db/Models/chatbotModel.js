const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const User = require('./userModel');


const ChatbotInteraction = sequelize.define('ChatbotInteraction', {
  interaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('baby_cry_advice', 'vaccination_schedule', 'mother_questions'),
    allowNull: false,
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
    indexes: [{ fields: ['user_id'] }],
    tableName:"ChatbotInteraction",
    timestamps: true,
  }
);


module.exports = ChatbotInteraction;

