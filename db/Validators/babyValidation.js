const Joi = require('joi');

const babyValidationSchema = Joi.object({
  baby_id: Joi.number().integer().optional(),
  baby_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Baby name is required.",
    "string.min": "Baby name must be at least 3 characters long.",
  }),

  // age_in_months: Joi.forbidden(), 
  birth_date: Joi.date().iso().required().messages({
    "date.base": "Birth date must be a valid date.",
    "date.iso": "Birth date must be in ISO format (YYYY-MM-DD).",
  }),
  gender: Joi.string().valid("male", "female").required().messages({
    "any.only": "Gender must be either 'male' or 'female'.",
  }),

  medical_conditions: Joi.string().allow(null, '').optional(), 
  user_id: Joi.number().integer().required(), 
});


module.exports = babyValidationSchema;
