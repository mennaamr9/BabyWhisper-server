const CryRecording = require('../../db/Models/cryRecordingModel');

describe('CryRecording Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = CryRecording.rawAttributes;

    // Check that all required fields are defined
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'recording_id',
        'file_path',
        'prediction',
        'suggestion',
        'file_format',
        'baby_id',
        'createdAt',
        'updatedAt',
      ])
    );

    // Check individual field definitions
    expect(attributes.recording_id.primaryKey).toBe(true);
    expect(attributes.recording_id.type.key).toBe('UUID');
    expect(attributes.recording_id.defaultValue.key).toBe('UUIDV4');

    expect(attributes.file_path.allowNull).toBe(false);
    expect(attributes.file_path.type.key).toBe('STRING');

    expect(attributes.prediction.allowNull).toBe(false);
    expect(attributes.prediction.type.key).toBe('STRING');

    expect(attributes.suggestion.allowNull).toBe(true);
    expect(attributes.suggestion.type.key).toBe('TEXT');

    expect(attributes.file_format.allowNull).toBe(true);
    expect(attributes.file_format.type.key).toBe('STRING');

    expect(attributes.baby_id.allowNull).toBe(false);
    expect(attributes.baby_id.references).toBeDefined();
    expect(attributes.baby_id.references.model).toBeDefined();
    expect(attributes.baby_id.references.key).toBe('baby_id');
    expect(attributes.baby_id.onDelete).toBe('CASCADE');
  });
});
