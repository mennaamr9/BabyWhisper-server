const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize } = require('../config/db');
const User = require("../db/Models/userModel");
const Baby = require("../db/Models/babyModel");
const CreateUserDTO = require('../Common/dtos/userDTO/cretaeUser.dto');
const CreateBabyDTO = require('../Common/dtos/babyDTO/createBaby.dto');


class AuthService {
  /**
   * Register a new user and their baby
   * @param {Object} dto - Combined user & baby registration data
   * @returns {Object} - Registered user, baby, and token
   */
  static async register(dto) {
    const transaction = await sequelize.transaction();
    try{

        // const dto = req.body;
        CreateUserDTO.validateCreateDTO(dto);
        CreateBabyDTO.validateCreateDTO(dto);


        if (!dto.email) {
            throw new Error("Email is missing in the request body");
        }
        
        // Check if user exists
        let userExists = await User.findOne({ where: { email: dto.email } });
        if (userExists) return res.status(400).json({ message: "User already exists" });

         // Hash password using DTO function
         dto.password = await CreateUserDTO.hashPassword(dto);

         if (req.file) {
            dto.profile_picture = req.file.path; // Save file path in DB
        }

        //create new user
        let userData = await CreateUserDTO.fromDTO(dto);
        const newUser = await User.create(userData,{transaction}); 
       
       

        //create new baby
        let babyData = await CreateBabyDTO.fromDTO(dto);
        babyData.user_id = newUser.user_id;
        const newBaby = await Baby.create(babyData, { transaction });

        
         //generate token
         const token = jwt.sign({ user_id: newUser.user_id }, process.env.JWT_SECRET_KEY ,{
            expiresIn : process.env.JWT_EXPIRE_DATE
           });

        // Commit transaction
        await transaction.commit();

        const userResponse = CreateUserDTO.toDTO(newUser);
        const babyResponse = CreateBabyDTO.toDTO(newBaby);


        return({ 
            message: "User registered successfully", 
            user: userResponse ,
            baby: babyResponse ? babyResponse :null ,
            token
        });


    } catch(error){
        await transaction.rollback();
        console.error("Validation Error:", error.message);
        throw error;  // Throw error so the controller can handle it
    }
  };



//   /**
//    * Login user
//    * @param {Object} loginData - User login credentials
//    * @returns {Object} - Authenticated user data and token
//    */
//   static async login(loginData) {
//     try {
//       const { email, password } = loginData;

//       // Find user by email
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//         throw new Error("Invalid email or password.");
//       }

//       // Check password
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         throw new Error("Invalid email or password.");
//       }

//       // Generate JWT token
//       const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//       return {
//         message: "Login successful!",
//         user: { id: user.user_id, username: user.username, email: user.email },
//         token,
//       };
//     } catch (error) {
//       throw error;
//     }
//   }
}

module.exports = AuthService;
