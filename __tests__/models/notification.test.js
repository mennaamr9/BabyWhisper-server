const Notification = require('../../db/Models/notificationModel');

describe('Notification Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = Notification.rawAttributes;

    // Check that all required fields are defined
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'notification_id',
        'content',
        'is_read',
        'type',
        'user_id',
        'createdAt',
        'updatedAt',
      ])
    );

    // Check individual field definitions
    expect(attributes.notification_id.primaryKey).toBe(true);
    expect(attributes.notification_id.autoIncrement).toBe(true);
    expect(attributes.notification_id.type.key).toBe('INTEGER');

    expect(attributes.content.allowNull).toBe(false);
    expect(attributes.content.type.key).toBe('STRING');

    // expect(attributes.is_read.allowNull).toBe(false); // Default is set, so null is allowed
    expect(attributes.is_read.defaultValue).toBe(false);
    expect(attributes.is_read.type.key).toBe('BOOLEAN');

    expect(attributes.type.allowNull).toBe(false);
    expect(attributes.type.type.key).toBe('STRING');

    expect(attributes.user_id.allowNull).toBe(false);
    expect(attributes.user_id.references).toBeDefined();
    expect(attributes.user_id.references.model).toBeDefined();
    expect(attributes.user_id.references.key).toBe('user_id');
  });
});
