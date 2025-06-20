const { markAsRead, getUserNotifications } = require('../../Controllers/notification.controller');
const Notification = require('../../db/Models/notificationModel');

jest.mock('../../db/Models/notificationModel');

describe('Notification Controllers', () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // -------- markAsRead --------
  describe('markAsRead', () => {
    it('marks a notification as read if found', async () => {
      const fakeNotification = {
        id: '1',
        is_read: false,
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.notification_id = '1';
      Notification.findByPk.mockResolvedValue(fakeNotification);

      await markAsRead(req, res);

      expect(Notification.findByPk).toHaveBeenCalledWith('1');
      expect(fakeNotification.is_read).toBe(true);
      expect(fakeNotification.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Marked as read',
        notification: fakeNotification
      });
    });

    it('returns 404 if notification not found', async () => {
      req.params.notification_id = '999';
      Notification.findByPk.mockResolvedValue(null);

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Notification not found' });
    });

    it('returns 500 on error', async () => {
      req.params.notification_id = '1';
      Notification.findByPk.mockRejectedValue(new Error('DB error'));

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'DB error'
      });
    });
  });

  // -------- getUserNotifications --------
  describe('getUserNotifications', () => {
    it('returns notifications for a given user', async () => {
      const fakeNotifications = [
        { id: 1, user_id: '10', content: 'Test notification' }
      ];

      req.params.user_id = '10';
      Notification.findAll.mockResolvedValue(fakeNotifications);

      await getUserNotifications(req, res);

      expect(Notification.findAll).toHaveBeenCalledWith({
        where: { user_id: '10' },
        order: [['createdAt', 'DESC']]
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeNotifications);
    });

    it('returns 500 on error', async () => {
      req.params.user_id = '10';
      Notification.findAll.mockRejectedValue(new Error('Query error'));

      await getUserNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Server error',
        error: 'Query error'
      });
    });
  });
});
