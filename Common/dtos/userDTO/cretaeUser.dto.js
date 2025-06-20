const bcrypt = require('bcryptjs');


class CreateUserDTO {
  // Convert entity to DTO (we won’t expose the password in the DTO)
  static toDTO(user) {
    if (!user) throw new Error("User data is required for mapping to DTO.");
    return {
      user_id: user.user_id,
      baby_name: user.name,
      email: user.email,
      profile_picture: user.profile_picture || null,
      number_of_baby: user.number_of_baby || 1,
    };
  }

  // Convert DTO to entity (for use in database or service layer)
  static fromDTO(dto) {
    if (!dto) throw new Error("DTO data is required for mapping to entity.");
    if (!dto.email) throw new Error("Email is missing in DTO");
    return {
      name: dto.name.trim(),
      email: dto.email.trim(),
      password: dto.password.trim(),  // Password will be hashed before saving
      profile_picture: dto.profile_picture,
      number_of_baby: dto.number_of_baby ?? 1,
      
    };
  }

  // Validate DTO data before it's used
  static validateCreateDTO(dto) {
    if (!dto.name || typeof dto.name !== "string" || !dto.name.trim()) {
      throw new Error("name is required and must be a string.");
    }
    if (!dto.email || !/^\S+@\S+\.\S+$/.test(dto.email.trim())) {
      throw new Error("A valid email is required.");
    }
    if (!dto.password || dto.password.length < 6) {
      throw new Error("Password is required and must be at least 6 characters.");
    }
    if (dto.number_of_baby !== undefined && typeof dto.number_of_baby !== "number") {
      throw new Error("Number of babies must be a number.");
    }
  
  }

  static async hashPassword(dto) {
    try {
      let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(dto.password , salt)
      return hashedPassword;
    } catch (error) {
      throw new Error("Error hashing password: " + error.message);
    }
  }
}

module.exports = CreateUserDTO;
