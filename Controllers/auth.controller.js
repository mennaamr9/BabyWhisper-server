const express = require("express");
const { error } = require("console");
const { sequelize } = require('../config/db');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const nodemailer = require('nodemailer');
const { Op } = require("sequelize");
const User = require('../db/Models/userModel')
const Baby = require('../db/Models/babyModel')
const Notification = require('../db/Models/notificationModel')
const { registerSchema } = require('../db/Validators/registerValidation');
const sendEmail = require('../utils/sendEmail');
const { createAndSendNotification } = require("../services/notification.services");



//register
const register = async (req, res) => {

    const transaction = await sequelize.transaction();
    try {
        const { name, email, password, confirmPassword, baby_name, birth_date, gender, medical_conditions } = req.body;

        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: "Validation error", details: error.details });
        }

        // Check if user already exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Build profile picture URL if file exists
        let profile_picture = null;
        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get("host")}`;
            profile_picture = `${baseUrl}/uploads/${req.file.filename}`;
        }

        // Create new user
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            profile_picture,
            is_verified: false

        }, { transaction });

        // Calculate baby's age in months
        const calculateAgeInMonths = (birthDate) => {
            const birth = new Date(birthDate);
            const now = new Date();
            return (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
        };

        // Create new baby
        const newBaby = await Baby.create({
            user_id: newUser.user_id,
            baby_name,
            birth_date,
            age_in_months: calculateAgeInMonths(birth_date),
            gender,
            medical_conditions
        }, { transaction });


        // Generate JWT token
        const Token = jwt.sign(
            { user_id: newUser.user_id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: process.env.JWT_EXPIRE_DATE }
        );

        await transaction.commit();

        res.status(200).json({
            message: "User registered successfully",
            user: {
                user_id: newUser.user_id,
                email: newUser.email,
                name: newUser.name,
                profile_picture,
            },
            baby: {
                baby_id: newBaby.baby_id,
                baby_name: newBaby.baby_name,
                birth_date: newBaby.birth_date,
                age_in_months: newBaby.age_in_months,
                gender: newBaby.gender,
                medical_conditions: newBaby.medical_conditions
            },
            Token
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }


};


//login
const Login = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }


        // Check if user exists
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET_KEY || "your_jwt_secret",
            { expiresIn: process.env.JWT_EXPIRE_DATE }
        );

        // Send login notification
        await Notification.create({
            content: " You’ve logged in successfully.",
            type: "login",
            user_id: user.user_id,
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                profile_picture: user.profile_picture,
                number_of_baby: user.number_of_baby
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }

};

//forgetPassword
const FrogetPass = async (req, res) => {
    try {

        //check if email exists , get user by email
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Generate a 6-digit code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashResetCode = crypto
            .createHash('sha256')
            .update(resetCode)
            .digest('hex');

        // console.log(resetCode);

        user.passResetCode = hashResetCode;
        user.passResetExpires = Date.now() + 10 * 60 * 1000;
        user.passVerified = false;

        await user.save()

        //send email 

        const message = `Hi ${user.name}, 
       \n we recived a request to reset the password on your BabyWhisper accout. 
       \n ${resetCode} 
       \n Enter these Code to complete the reset password`;

        await sendEmail({
            email: user.email,
            subject: "Your Reset Code (Valid for 5 min)",
            message,
        })


        res.status(200).json({ message: "Reset code sent to your email" });

    } catch (err) {
        console.error("Forget Password Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }

};

//VerifyResetCode
const VerifyResetCode = async (req, res) => {
    try {

        const { resetCode } = req.body;
        if (!resetCode)
            return res.status(400).json({ message: "Reset code is required" });

        //get user based on reset code 
        const hashResetCode = crypto
            .createHash('sha256')
            .update(resetCode)
            .digest('hex');

        const user = await User.findOne({
            where: {
                passResetCode: hashResetCode,
                passResetExpires: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "Reset code invalide or expired " });
        }

        //Reset code valid

        user.passVerified = true;
        await user.save()

        res.status(200).json({
            status: "success",
            Message: "you are verified ",
            email: user.email
        })


    } catch (err) {
        console.error("VerifyResetCode:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }

};


//resetPassword
const ResetPass = async (req, res) => {

    try {

        const { email, newPassword } = req.body;
        const user = await User.findOne({ where: { email, passVerified: true } });


        if (!user) {
            return res.status(404).json({ message: "Reset code invalide or expired " });
        }

        //check if the resetCode is verified 
        if (!user.passVerified) {
            return res.status(404).json({ message: "Reset Code is not verified" })
        }

        // user.password = req.body.newPassword;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.passResetCode = undefined;
        user.passResetExpires = undefined;
        user.passVerified = undefined;

        await user.save();

        //generate new token 
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET_KEY || "your_jwt_secret",
            { expiresIn: process.env.JWT_EXPIRE_DATE }
        );
        return res.status(200).json({ token, message: "reset passwored is success" })


    } catch (err) {
        console.error("Reset Password Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }

};



module.exports = {
    Login,
    register,
    FrogetPass,
    VerifyResetCode,
    ResetPass,
}