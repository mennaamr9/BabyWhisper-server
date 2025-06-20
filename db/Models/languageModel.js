const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');

  const Language = sequelize.define('Language', {
    
    language_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.ENUM, 
      values: ['en', 'ar'],
      defaultValue: 'en',
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    direction: {
      type: DataTypes.ENUM,
      values: ['LTR', 'RTL'],
      defaultValue: 'LTR',
      allowNull: false,
    },
  });

  module.exports =Language;





