class NotificationDTO {
  constructor(notification) {
    if (!notification) throw new Error('Notification entity is required.');
    this.notification_id = notification.notification_id;
    this.content = notification.content;
    this.is_read = notification.is_read;
    this.type = notification.type;
    this.user_id = notification.user_id;
  }
}

module.exports = NotificationDTO;
