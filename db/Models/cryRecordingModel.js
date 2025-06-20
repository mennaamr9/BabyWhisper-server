const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const Baby = require('./babyModel')


  const CryRecording = sequelize.define('CryRecording', {
    recording_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    prediction: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    suggestion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    file_format: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    baby_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Baby, 
        key: 'baby_id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'CryRecording',
    timestamps: true,
  }
);
  
module.exports = CryRecording;


