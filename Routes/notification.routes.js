const express = require("express");
const router = express.Router();
const notificationControllers = require("../Controllers/notification.controller");

router.get("/getUserNotifications/:user_id", notificationControllers.getUserNotifications);       // GET /notification/:user_id
router.put("/ ", notificationControllers.markAsRead);     // PUT /notification/:notification_id/read

module.exports = router;
