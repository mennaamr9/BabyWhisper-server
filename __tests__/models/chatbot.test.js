const ChatbotInteraction = require('../../db/Models/chatbotModel');

describe('ChatbotInteraction Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = ChatbotInteraction.rawAttributes;

    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'interaction_id',
        'message',
        'response',
        'category',
        'user_id',
        'createdAt',
        'updatedAt',
      ])
    );

    // interaction_id
    expect(attributes.interaction_id.primaryKey).toBe(true);
    expect(attributes.interaction_id.defaultValue.key).toBe('UUIDV4');
    expect(attributes.interaction_id.type.key).toBe('UUID');

    // message
    expect(attributes.message.allowNull).toBe(false);
    expect(attributes.message.type.key).toBe('TEXT');

    // response
    expect(attributes.response.allowNull).toBe(false);
    expect(attributes.response.type.key).toBe('TEXT');

    // category
    expect(attributes.category.allowNull).toBe(false);
    expect(attributes.category.type.key).toBe('ENUM');
    expect(attributes.category.type.values).toEqual(
      expect.arrayContaining(['baby_cry_advice', 'vaccination_schedule', 'mother_questions'])
    );

    // user_id
    expect(attributes.user_id.allowNull).toBe(false);
    expect(attributes.user_id.references.model).toBeDefined();
    expect(attributes.user_id.references.key).toBe('user_id');
    expect(attributes.user_id.type.key).toBe('INTEGER');
  });
});
