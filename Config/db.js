const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
require("dotenv").config();


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT) || 3306,
    logging: false,
  }
);

module.exports = { sequelize, Sequelize };
