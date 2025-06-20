class BabyDTO {
  constructor(baby) {
    this.baby_id = baby.baby_id;
    this.baby_name = baby.baby_name;
    this.age_in_months = baby.age_in_months;
    this.birth_date = baby.birth_date;
    this.gender = baby.gender;
    this.medical_conditions = baby.medical_conditions;
    this.user_id = baby.user_id;
    this.created_at = baby.createdAt;
    this.updated_at = baby.updatedAt;
  }
}

module.exports = BabyDTO;
