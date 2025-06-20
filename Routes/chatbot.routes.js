// routes/chatbotRoutes.js
const express = require('express');
const router = express.Router();
const chatbotController = require('../Controllers/chatbot.controller');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes
router.get('/get_categories', chatbotController.getCategories);
router.get('/get-subcategories', chatbotController.getSubCategories);

module.exports = router;
