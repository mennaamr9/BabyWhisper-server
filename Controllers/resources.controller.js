const sequelize = require('../Config/db');
const express = require("express");
const Resource =require('../db/Models/resourceModel');


//getAllResources
const getAllResources = async (req, res) => {
  try {

    const resources = await Resource.findAll();

    res.status(200).json({ status: "success", data: { resources } });
  } catch (error) {
    console.error("Database Error:", error);
     res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message
    });
  }
};

//getResourceById
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findByPk(id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ status: "success", data: resource });
  } catch (error) {
    console.error("Error fetching resource by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//getResourcesByCategory
const getResourcesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const resources = await Resource.findAll({
      where: { category }
    });

    if (!resources || resources.length === 0) {
      return res.status(404).json({ message: "No resources found for this category" });
    }

    res.status(200).json({ status: "success", data: resources });
  } catch (error) {
    console.error("Error fetching resources by category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// //getResourcesByUserId
// const getResourcesByUserId = async (req, res) => {
//   try {
//     const { user_id } = req.params;

//     const resources = await Resource.findAll({ where: { user_id } });

//     res.status(200).json({ status: "success", data: resources });
//   } catch (error) {
//     console.error("Error fetching resources by user_id:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };





module.exports = {
    getAllResources,
    getResourceById,
    getResourcesByCategory
}
