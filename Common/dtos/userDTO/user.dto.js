class UserDTO {
  // Convert entity to DTO
  static toDTO(user) {
    if (!user) throw new Error("User data is required for mapping to DTO.");

    // Return the DTO object
    return {
      user_id: user.user_id || null,
      name: user.name || "",
      email: user.email || "",
      profile_picture: user.profile_picture || null,
      number_of_baby: user.number_of_baby || 1,
      // language_id: user.language_id || "en", // default to "en"
    };
  }

  // Convert DTO to entity (for use in database or service layer)
  static fromDTO(dto) {
    if (!dto) throw new Error("DTO data is required for mapping to entity.");

    // Map DTO back to entity format
    return {
      user_id: dto.user_id || null,
      name: dto.name || "",
      email: dto.email || "",
      profile_picture: dto.profile_picture || null,
      number_of_baby: dto.number_of_baby || 1,
      // language_id: dto.language_id || "en", // default to "en"
    };
  }

  // Validate DTO data before it's used
  static validateDTO(dto) {
    if (!dto.name || typeof dto.name !== "string") {
      throw new Error("Name is required and must be a string.");
    }
    if (!dto.email || !/^\S+@\S+\.\S+$/.test(dto.email)) {
      throw new Error("A valid email is required.");
    }
    if (dto.number_of_baby && typeof dto.number_of_baby !== "number") {
      throw new Error("Number of babies must be a number.");
    }
    // if (dto.language_preference && typeof dto.language_preference !== "string") {
    //   throw new Error("Language preference must be a string.");
    // }
  }
}

module.exports = UserDTO;
