
class CreateBabyDTO {
  // Convert entity to DTO 
  static toDTO(baby) {
    if (!baby) throw new Error("baby data is required for mapping to DTO.");
    return {
      baby_id: baby.baby_id,
      baby_name: baby.baby_name,
      // age_in_months : baby.age_in_months,
      birth_date : baby.birth_date,
      gender : baby.gender,
      medical_conditions : baby.medical_conditions,
      user_id : baby.user_id,
    };
  }

  // Convert DTO to entity (for use in database or service layer)
  static fromDTO(dto) {
    if (!dto) throw new Error("DTO data is required for mapping to entity.");
    return {

      // baby_id: dto.baby.baby_id,
      baby_name: dto.baby_name.trim(),
      // age_in_months : dto.age_in_months,
      birth_date : dto.birth_date.trim(),
      gender : dto.gender.trim(),
      medical_conditions : dto.medical_conditions,
      user_id : dto.user_id,
    };
  }

  // Validate DTO data before it's used
  static validateCreateDTO(dto){
    if (!dto.baby_name || typeof dto.baby_name !== "string" || !dto.baby_name.trim()) 
       throw new Error("Name is required");

    // if (!dto.age_in_months || isNaN(dto.age_in_months)) 
    //    throw new Error("Age in months must be a number");

    if (!dto.birth_date) 
       throw new Error("Birth date is required");

    if (!dto.gender || !['male', 'female'].includes(dto.gender.toLowerCase())) 
       throw new Error("Gender must be 'male' or 'female'");

}

// Calculate age in months (useful for when we need to set age after validation)
 static calculateAgeInMonths(birthDateStr) {
  const birthDate = new Date(birthDateStr);
  const now = new Date();

  let months = (now.getFullYear() - birthDate.getFullYear()) * 12;
  months -= birthDate.getMonth();
  months += now.getMonth();

  if (now.getDate() < birthDate.getDate()) {
    months -= 1;
  }

  return months <= 0 ? 0 : months;
}




  }


  



  

module.exports = CreateBabyDTO;
