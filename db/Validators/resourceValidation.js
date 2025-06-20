const Joi = require('joi');

const resourceSchema  = Joi.object({

  resource_type: Joi.string().valid("article", "video").required().messages({
    "any.only": "Resource type must be either 'article' or 'video'",
  }),
  title: Joi.string().trim().min(5).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),
  content: Joi.string().trim().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
  }),
  category_id: Joi.number().integer().required().messages({
    "number.base": "Category ID must be a number",
    "any.required": "Category ID is required",
  }),

});

module.exports = resourceSchema ;
