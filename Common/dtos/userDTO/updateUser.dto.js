class UpdateUserDTO {
    // Convert entity to DTO for updating (will not expose password)
    static toDTO(user) {
      if (!user) throw new Error("User data is required for mapping to DTO.");
      return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture || null,
        number_of_baby: user.number_of_baby || 0,
        language_id: user.language_id || "en",
        // Password is excluded in the DTO response
      };
    }
  
    // Convert DTO to entity for updating user data in database
    static fromDTO(dto) {
      if (!dto) throw new Error("DTO data is required for mapping to entity.");
      return {
        user_id: dto.user_id,  // User ID is necessary to find the record in the DB
        name: dto.name,
        email: dto.email,
        profile_picture: dto.profile_picture,
        number_of_baby: dto.number_of_baby,
        language_id: dto.language_id,
        // We do not require password in an update request unless the password is being changed
        password: dto.password,
      };
    }
  
    // Validate DTO data for updating user profile
    static validateUpdateDTO(dto) {
      if (dto.name && typeof dto.name !== "string") {
        throw new Error("Name must be a string.");
      }
      if (dto.email && !/^\S+@\S+\.\S+$/.test(dto.email)) {
        throw new Error("A valid email is required.");
      }
      if (dto.number_of_baby && typeof dto.number_of_baby !== "number") {
        throw new Error("Number of babies must be a number.");
      }
      // if (dto.language_preference && typeof dto.language_preference !== "string") {
      //   throw new Error("Language preference must be a string.");
      // }
      // If password is included, it should follow a password policy
      if (dto.password && dto.password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
    }
  }
  
  module.exports = UpdateUserDTO;
  