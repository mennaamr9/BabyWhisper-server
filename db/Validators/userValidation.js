const Joi = require('joi');

const createUserSchema  = Joi.object({
  user_id: Joi.number().integer().optional(), 
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email format.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 6 characters long.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    "any.only": "Passwords do not match.",
    "string.empty": "Confirm Password is required."
  }),
  profile_picture: Joi.string().optional(),
 
  is_verified: Joi.boolean().optional(), 
  reset_code: Joi.string().pattern(/^\d{5}$/).optional(), 
  reset_code_expires: Joi.date().optional()

});


// Schema for updating a user
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  email: Joi.string().email().optional(),
  profile_picture: Joi.string().uri().optional(),
});


module.exports = {createUserSchema ,updateUserSchema };
