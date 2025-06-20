
const Baby = require('../../db/Models/babyModel');

describe('Baby Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = Baby.rawAttributes;

    // Check expected fields exist
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'baby_id',
        'baby_name',
        'age_in_months',
        'birth_date',
        'gender',
        'medical_conditions',
        'user_id',
        'createdAt',
        'updatedAt',
      ])
    );

    // Check field types and constraints
    expect(attributes.baby_id.primaryKey).toBe(true);
    expect(attributes.baby_id.autoIncrement).toBe(true);
    expect(attributes.baby_id.type.key).toBe('INTEGER');

    expect(attributes.baby_name.allowNull).toBe(false);
    expect(attributes.baby_name.type.key).toBe('STRING');

    expect(attributes.age_in_months.allowNull).toBe(true);
    expect(attributes.age_in_months.type.key).toBe('INTEGER');

    expect(attributes.birth_date.allowNull).toBe(false);
    expect(attributes.birth_date.type.key).toBe('DATEONLY');

    expect(attributes.gender.allowNull).toBe(false);
    expect(attributes.gender.type.key).toBe('ENUM');
    expect(attributes.gender.values).toEqual(['male', 'female']);

    expect(attributes.medical_conditions.allowNull).toBe(true);
    expect(attributes.medical_conditions.type.key).toBe('TEXT');

    expect(attributes.user_id.allowNull).toBe(false);
    expect(attributes.user_id.references.model).toBe('Users'); // Sequelize pluralizes
    expect(attributes.user_id.onDelete).toBe('CASCADE');
  });
});
