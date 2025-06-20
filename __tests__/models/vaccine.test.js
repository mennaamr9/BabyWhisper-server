const Vaccine = require('../../db/Models/vaccineModel'); 

describe('Vaccine Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = Vaccine.rawAttributes;

    // Ensure all expected fields are defined
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'vaccine_id',
        'vaccine_name',
        'disease',
        'dosage',
        'route',
      ])
    );

    // Test field: vaccine_id
    expect(attributes.vaccine_id.primaryKey).toBe(true);
    expect(attributes.vaccine_id.autoIncrement).toBe(true);
    expect(attributes.vaccine_id.type.key).toBe('INTEGER');

    // Test field: vaccine_name
    expect(attributes.vaccine_name.allowNull).toBe(false);
    expect(attributes.vaccine_name.type.key).toBe('STRING');

    // Test field: disease
    expect(attributes.disease.allowNull).toBe(false);
    expect(attributes.disease.type.key).toBe('STRING');

    // Test field: dosage
    expect(attributes.dosage.allowNull).toBe(false);
    expect(attributes.dosage.type.key).toBe('STRING');

    // Test field: route
    expect(attributes.route.allowNull).toBe(false);
    expect(attributes.route.type.key).toBe('STRING');
  });

  test('should not use timestamps', () => {
    expect(Vaccine.options.timestamps).toBe(false);
  });
});
