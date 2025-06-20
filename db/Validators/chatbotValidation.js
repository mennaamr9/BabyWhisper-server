const Joi = require('joi');

const chatbotInteractionValidationSchema = Joi.object({
  interaction_id: Joi.string().uuid().optional(), // Matches Sequelize UUID
  message: Joi.string().min(1).max(500).required(),
  response: Joi.string().min(1).max(500).optional(),
  user_id: Joi.number().integer().required(), // Foreign key to User
});

module.exports = chatbotInteractionValidationSchema;
