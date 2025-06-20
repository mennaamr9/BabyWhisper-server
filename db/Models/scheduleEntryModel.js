const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const Vaccine =require ('./vaccineModel');
const Dose =require('../Models/doseModel');

  const schedule_entries = sequelize.define('schedule_entries', {
    
    entry_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    age_group: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dose_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Dose, 
        key: 'dose_id',
      },
      onDelete: 'CASCADE',
    },
    vaccine_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Vaccine, 
        key: 'vaccine_id',
      },
      onDelete: 'CASCADE',
    }
 },
    {
      tableName:"schedule_entrie",
      timestamps: false,
    }
 );

  module.exports = schedule_entries  ;





