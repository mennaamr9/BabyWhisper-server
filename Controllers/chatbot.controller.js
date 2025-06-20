const sequelize = require('../Config/db');
const express = require("express");
const axios = require('axios');


  const getCategories = async (req , res)=>{
  try {
    const response = await axios.get('http://127.0.0.1:8000/get_categories');
    const category = response.data;

    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error calling Flask API:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories from AI model'
    });
  }
};


const getSubCategories = async (req, res) => {
  try {
    const category = req.query.category;

    const response = await axios.get('http://localhost:5000/get_subcategories', {
      params: { category },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error.message);

    
    if (error.response) {
      console.error('Response data:', error.response.data);
    }

    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message,
    });
  }
};


 module.exports = {
  getCategories,
  getSubCategories

}