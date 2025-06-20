const Joi = require('joi');

const registerSchema  = Joi.object({
//   user_id: Joi.number().integer().optional(), 
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 3 characters long.",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Invalid email format.",
  }),
  password: Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\\-={}\\[\\]:;"\'<>,.?/~`]).*$'))
  .required()
  .messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters long.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter and one special character.",
  }),

  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    "any.only": "Passwords do not match.",
    "string.empty": "Confirm Password is required."
  }),
  profile_picture: Joi.string().uri().optional(), 
//   baby_id: Joi.number().integer().optional(), 
  baby_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Baby name is required.",
    "string.min": "Baby name must be at least 3 characters long.",
  }),

  // age_in_months: Joi.number().integer().min(0).required(), 
  birth_date: Joi.date().iso().required().messages({
    "date.base": "Birth date must be a valid date.",
    "date.iso": "Birth date must be in ISO format (YYYY-MM-DD).",
  }),
  gender: Joi.string().valid("male", "female").required().messages({
    "any.only": "Gender must be either 'male' or 'female'.",
  }),

  medical_conditions: Joi.string().allow(null, '').optional(), 


});




module.exports = {registerSchema};
