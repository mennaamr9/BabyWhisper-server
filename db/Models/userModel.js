const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');


const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_picture: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  passChangedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passResetCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  passResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  passVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

},
  {
    tableName: "User",
    timestamps: true,
  }
);

module.exports = User;

