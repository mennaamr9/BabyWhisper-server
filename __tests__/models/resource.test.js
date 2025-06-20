const Resource = require('../../db/Models/resourceModel'); 

describe('Resource Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = Resource.rawAttributes;

    // Check if all expected fields exist
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'resource_id',
        'resource_type',
        'title',
        'content',
        'category',
        'user_id',       
        'createdAt',
        'updatedAt',
      ])
    );

    // resource_id
    expect(attributes.resource_id.primaryKey).toBe(true);
    expect(attributes.resource_id.autoIncrement).toBe(true);
    expect(attributes.resource_id.type.key).toBe('INTEGER');

    // resource_type
    expect(attributes.resource_type.allowNull).toBe(false);
    expect(attributes.resource_type.type.values).toEqual(expect.arrayContaining(['article', 'video']));

    // title
    expect(attributes.title.allowNull).toBe(false);
    expect(attributes.title.type.key).toBe('STRING');

    // content
    expect(attributes.content.allowNull).toBe(false);
    expect(attributes.content.type.key).toBe('TEXT');

    // category
    expect(attributes.category.allowNull).toBe(false);
    expect(attributes.category.type.key).toBe('STRING');

    // user_id
    expect(attributes.user_id.allowNull).toBe(true);  // ✅ matches your model
    expect(attributes.user_id.type.key).toBe('INTEGER'); // foreign key type
  });
});
