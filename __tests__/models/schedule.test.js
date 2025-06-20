const ScheduleEntries = require('../../db/Models/scheduleEntryModel'); 

describe('ScheduleEntries Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = ScheduleEntries.rawAttributes;

    // Check that all required fields are defined
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'entry_id',
        'age_group',
        'dose_id',
        'vaccine_id',
      ])
    );

    // Check individual field definitions
    expect(attributes.entry_id.primaryKey).toBe(true);
    expect(attributes.entry_id.autoIncrement).toBe(true);
    expect(attributes.entry_id.type.key).toBe('INTEGER');

    expect(attributes.age_group.allowNull).toBe(false);
    expect(attributes.age_group.type.key).toBe('STRING');

    expect(attributes.dose_id.allowNull).toBe(false);
    expect(attributes.dose_id.references).toBeDefined();
    expect(attributes.dose_id.references.model).toBeDefined();
    expect(attributes.dose_id.references.key).toBe('dose_id');
    expect(attributes.dose_id.onDelete).toBe('CASCADE');

    expect(attributes.vaccine_id.allowNull).toBe(false);
    expect(attributes.vaccine_id.references).toBeDefined();
    expect(attributes.vaccine_id.references.model).toBeDefined();
    expect(attributes.vaccine_id.references.key).toBe('vaccine_id');
    expect(attributes.vaccine_id.onDelete).toBe('CASCADE');
  });

  test('should not use timestamps', () => {
    expect(ScheduleEntries.options.timestamps).toBe(false);
  });
});
