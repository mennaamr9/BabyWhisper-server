const Doses = require('../../db/Models/doseModel'); // Adjust path as necessary

describe('Doses Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = Doses.rawAttributes;

    // Ensure all expected fields are defined
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'dose_id',
        'dose_name',
      ])
    );

    // Test field: dose_id
    expect(attributes.dose_id.primaryKey).toBe(true);
    expect(attributes.dose_id.autoIncrement).toBe(true);
    expect(attributes.dose_id.type.key).toBe('INTEGER');

    // Test field: dose_name
    expect(attributes.dose_name.allowNull).toBe(false);
    expect(attributes.dose_name.type.key).toBe('STRING');
  });

  test('should not use timestamps', () => {
    expect(Doses.options.timestamps).toBe(false);
  });
});
