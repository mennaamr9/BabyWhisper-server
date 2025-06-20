const Joi = require('joi');

const notificationValidationSchema = Joi.object({
  notification_id: Joi.string().uuid().optional(), // Sequelize auto-generates
  content: Joi.string().max(255).required(),
  type: Joi.string().valid('info', 'alert', 'reminder').required(),
  is_read: Joi.boolean().optional().default(false),
  user_id: Joi.number().integer().required(), // Foreign key to User
});

module.exports = notificationValidationSchema;
