const User = require("../db/Models/userModel");

const hashPassword = async (req , res , next)=> {
    try {
      let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(req.password , salt)
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password: " + error.message);
    }

  }

  module.exports = hashPassword;