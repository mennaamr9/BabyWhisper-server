class LanguageDTO {
  constructor(language) {
    if (!language) throw new Error('Language entity is required.');
    this.language_id = language.language_id;
    this.name = language.name;
    this.code = language.code;
    this.is_active = language.is_active;
    this.direction = language.direction;
  }
}

module.exports = LanguageDTO;
