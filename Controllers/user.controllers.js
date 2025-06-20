const sequelize = require('../Config/db');
const express = require("express");
const User =require('../db/Models/userModel');
const Baby =require('../db/Models/babyModel');


//getAllUsers
const getAllUsers = async (req , res) => {
    try {
        
        let users = await User.findAll({
          include: [
            {
                model: Baby,
                as: "babies", 
                required: false,
            },
          ],
        });
        
        res.status(200).json({ status: "success", data: { users } });
      } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
    

};

//getAllUsersById
const getAllUsersById = async(req , res) => {
    try {
        const userId = parseInt(req.params.id, 10); // Convert ID to number

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

      // Fetch user with associated babies
      const user = await User.findByPk(userId, {
        include: [
            {
                model: Baby,
                as: "babies", // Must match the alias in associations
            },
        ],
    });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user); // Return user object
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }

};

//updateUser
const updateUserById = async(req , res)  => {

    try {
        const userId = parseInt(req.params.id, 10); // Convert ID to number
        // const { User, Baby } = req.body; // Include babies array from request

        const { name, email, password, profile_picture, number_of_baby, baby_name, age_in_months , birth_date , gender , medical_conditions  } = req.body; // Extract user & babies data

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find the user
        const user = await User.findByPk(userId, {
            include: [{ model: Baby, as: "babies" }],
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user details
        await user.update({ name, email, password, profile_picture, number_of_baby });
        let baby = await Baby.findOne({ where: { user_id: userId } });

        if (baby) {
            // Update existing baby
            await baby.update({ baby_name, age_in_months, birth_date, gender });
        } else {
            // If no baby exists, create a new one
            baby = await Baby.create({
                baby_name,
                age_in_months,
                birth_date,
                gender,
                medical_conditions,
                user_id: userId,
            });
        }

        // Fetch updated user with babies
        const updatedUser = await User.findByPk(userId, {
            include: [{ model: Baby, as: "babies" }],
        });

        res.status(200).json({ message: 'User and babies updated successfully', user: updatedUser });

    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//deleteUser
const deleteUserById  = async(req , res) => {
    try {
        const userId = parseInt(req.params.id, 10); // Convert ID to number

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find the user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user
        await user.destroy();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getAllUsersById,
    updateUserById,
    deleteUserById ,
}