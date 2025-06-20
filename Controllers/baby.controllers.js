const { sequelize } = require('../config/db');
const express = require("express");
const Baby = require('../db/Models/babyModel')


// getAllBabiesByUserId 
const  getAllBabiesByUserId  = async(req , res) => {
    // try {
    //     const userId = parseInt(req.params.user_id, 10); // Convert userId to integer

    //     if (isNaN(userId)) {
    //         return res.status(400).json({ message: 'Invalid user ID' });
    //     }

    //     const babies = await Baby.findAll({ where: { userId } });

    //     if (babies.length === 0) {
    //         return res.status(404).json({ message: 'No babies found for this user' });
    //     }

    //     res.status(200).json({ babies });
    // } catch (error) {
    //     console.error('Database Error:', error);
    //     res.status(500).json({ message: 'Server error', error: error.message });
    // }
    try {
       const userId = parseInt(req.params.user_id, 10);

        // Validate if userId is a number
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Query to get all babies for the user
        const [babies] = await sequelize.query(
            "SELECT * FROM babies WHERE userId = ?",
            { replacements: [userId], type: sequelize.QueryTypes.SELECT }
        );

        if (babies.length === 0) {
            return res.status(404).json({ message: "No babies found for this user" });
        }

        res.status(200).json({ babies });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }    
};

//getAllUsersById
const getAllBabiesById = async(req , res) => {
 
};

//updateBabyById
const updateBabyById = async(req , res) => {
 
};

//deleteBabyById
const deleteBabyById = async(req , res) => {
 
};

module.exports = {
    getAllBabiesByUserId ,
    getAllBabiesById,
    updateBabyById,
    deleteBabyById,
}