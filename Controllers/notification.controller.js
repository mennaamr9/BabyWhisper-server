const Notification = require("../db/Models/notificationModel");

const markAsRead = async (req, res) => {
  try {
    const { notification_id } = req.params;

    const notification = await Notification.findByPk(notification_id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.is_read = true;
    await notification.save();

    res.status(200).json({ message: "Marked as read", notification });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUserNotifications = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      const notifications = await Notification.findAll({
        where: { user_id },
        order: [['createdAt', 'DESC']]
      });
  
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  module.exports = { getUserNotifications, markAsRead };
  
