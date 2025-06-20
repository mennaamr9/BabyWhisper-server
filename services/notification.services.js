const { sequelize } = require('../Config/db');
const { io, onlineUsers } = require('../sockets/socketManager');

const createAndSendNotification = async (userId, content, type = "info") => {
    try {
      // Save in DB using Sequelize
      const notification = await Notification.create({
        user_id: userId,
        content,
        type,
      });
  
      // Emit to user if online
      const socketId = onlineUsers.get(userId);
      if (socketId) {
        io.to(socketId).emit("notification", {
          notification_id: notification.notification_id,
          content: notification.content,
          type: notification.type,
          timestamp: notification.createdAt,
          is_read: notification.is_read,
        });
      }
    } catch (error) {
      console.error(" Error sending notification:", error);
    }
  };

module.exports = {
  createAndSendNotification
};
