const User = require('../../db/Models/userModel');
const { createUserSchema, updateUserSchema } = require('../../db/Validators/userValidation');

describe('User Model Definition', () => {
  test('should define all expected fields with correct configuration', () => {
    const attributes = User.rawAttributes;

    // Check that all required fields are defined
    expect(Object.keys(attributes)).toEqual(
      expect.arrayContaining([
        'user_id',
        'name',
        'email',
        'password',
        'profile_picture',
        'is_verified',
        'passChangedAt',
        'passResetCode',
        'passResetExpires',
        'passVerified',
        'createdAt',
        'updatedAt',
      ])
    );

    // Check individual field definitions
    expect(attributes.user_id.primaryKey).toBe(true);
    expect(attributes.user_id.autoIncrement).toBe(true);
    expect(attributes.user_id.type.key).toBe('INTEGER');

    expect(attributes.name.allowNull).toBe(false);
    expect(attributes.name.type.key).toBe('STRING');

    expect(attributes.email.allowNull).toBe(false);
    expect(attributes.email.unique).toBe(true);
    expect(attributes.email.type.key).toBe('STRING');

    expect(attributes.password.allowNull).toBe(false);
    expect(attributes.password.type.key).toBe('STRING');

    expect(attributes.profile_picture.allowNull).toBe(true);
    expect(attributes.profile_picture.type.key).toBe('STRING');

    // expect(attributes.is_verified.defaultValue).toBe(false);
    expect(attributes.passVerified.defaultValue).toBe(false);
  });
});



describe('User Validation - createUserSchema', () => {
  test('should pass validation with valid input', () => {
    const validData = {
      name: 'Menna Amr',
      email: 'menna@example.com',
      password: 'strongpass123',
      confirmPassword: 'strongpass123',
      profile_picture: 'http://example.com/image.png',
      is_verified: false,
      reset_code: '12345',
      reset_code_expires: new Date(),
    };

    const { error } = createUserSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  test('should fail when name is too short', () => {
    const invalidData = {
      name: 'Me',
      email: 'menna@example.com',
      password: 'strongpass',
      confirmPassword: 'strongpass',
    };

    const { error } = createUserSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('Name must be at least 3 characters long.');
  });

  test('should fail when email is invalid', () => {
    const invalidData = {
      name: 'Menna',
      email: 'not-an-email',
      password: 'strongpass',
      confirmPassword: 'strongpass',
    };

    const { error } = createUserSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('Invalid email format.');
  });

  test('should fail when passwords do not match', () => {
    const invalidData = {
      name: 'Menna',
      email: 'menna@example.com',
      password: 'strongpass',
      confirmPassword: 'differentpass',
    };

    const { error } = createUserSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('Passwords do not match.');
  });

  test('should fail when reset code is not 5 digits', () => {
    const invalidData = {
      name: 'Menna',
      email: 'menna@example.com',
      password: 'strongpass',
      confirmPassword: 'strongpass',
      reset_code: '1234',
    };

    const { error } = createUserSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.details[0].message).toContain('fails to match the required pattern');
  });
});

describe('User Validation - updateUserSchema', () => {
  test('should pass with valid optional fields', () => {
    const validUpdate = {
      name: 'Updated Menna',
      email: 'updated@example.com',
      profile_picture: 'http://example.com/profile.jpg',
    };

    const { error } = updateUserSchema.validate(validUpdate);
    expect(error).toBeUndefined();
  });

  test('should fail with invalid email format in update', () => {
    const invalidUpdate = {
      email: 'not-an-email',
    };

    const { error } = updateUserSchema.validate(invalidUpdate);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('\"email\" must be a valid email');
  });

  test('should fail with invalid profile picture URI', () => {
    const invalidUpdate = {
      profile_picture: 'not-a-url',
    };

    const { error } = updateUserSchema.validate(invalidUpdate);
    expect(error).toBeDefined();
    expect(error.details[0].message).toBe('\"profile_picture\" must be a valid uri');
  });
});
