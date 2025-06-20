const { DataTypes } = require('sequelize');
const { sequelize } = require('../../Config/db');
const User = require('./userModel')


const Baby = sequelize.define('Baby', {
  baby_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  baby_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age_in_months: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  medical_conditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },

},
  {
    tableName: "Baby",
    timestamps: true,
    hooks: {
      // Before create or update, calculate the age_in_months based on birth_date
      beforeCreate: (baby, options) => {
        baby.age_in_months = calculateAgeInMonths(baby.birth_date);
      },
      beforeUpdate: (baby, options) => {
        baby.age_in_months = calculateAgeInMonths(baby.birth_date);
      }
    }
  }
);
const calculateAgeInMonths = (birthDateStr) => {
  const birthDate = new Date(birthDateStr);
  const now = new Date();

  let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += now.getMonth();

  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  return months <= 0 ? 0 : months;
};

if (!sequelize) {
  throw new Error("Sequelize instance is undefined");
}

module.exports = Baby;
