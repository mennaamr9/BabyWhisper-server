const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');

  const Vaccine = sequelize.define('Vaccine', {
    
    vaccine_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    vaccine_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false
    }
 },
    {
      tableName:"Vaccine",
      timestamps: false,
    }
 );

  module.exports =Vaccine;





