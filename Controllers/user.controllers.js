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

        const { name, email, baby_name , birth_date , gender , medical_conditions  } = req.body; // Extract user & babies data

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

        const profile_picture = req.file
        ? `http://localhost:8000/uploads/${req.file.filename}`
        : user.profile_picture;

        // Update user details
        await user.update({ name, email, profile_picture });
        // let baby = await Baby.findOne({ where: { user_id: userId } });

        // get only the first baby from the request
    let babies = [];
    if (req.body.babies) {
      babies = JSON.parse(req.body.babies);
    }

    const babyData = babies[0]; // فقط أول طفل

    if (babyData) {
      const age_in_months = (() => {
        const birth = new Date(babyData.birth_date);
        const now = new Date();
        return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
      })();

      let baby = await Baby.findOne({ where: { user_id: userId } });

      if (baby) {
        await baby.update({
          baby_name: babyData.baby_name,
          birth_date: babyData.birth_date,
          gender: babyData.gender,
          age_in_months,
          medical_conditions: babyData.medical_conditions,
        });
      } else {
        await Baby.create({
          baby_name: babyData.baby_name,
          birth_date: babyData.birth_date,
          gender: babyData.gender,
          age_in_months,
          medical_conditions: babyData.medical_conditions,
          user_id: userId,
        });
      }
    }

    const updatedUser = await User.findByPk(userId, {
      include: [{ model: Baby, as: "babies" }],
    });

    res.status(200).json({
      message: "User and baby updated successfully",
      user: updatedUser,
    });
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