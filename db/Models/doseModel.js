const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');

  const doses = sequelize.define('doses', {
    
    dose_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    dose_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
 },
    {
      tableName: "doses",
      timestamps: false,
    }
 );

  module.exports = doses ;





