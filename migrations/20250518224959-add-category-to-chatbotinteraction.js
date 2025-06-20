'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('ChatbotInteraction', 'category', {
      type: Sequelize.ENUM('baby_cry_advice', 'vaccination_schedule', 'mother_questions'),
      allowNull: false,
      defaultValue: 'mother_questions', // or whatever makes sense as default
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('ChatbotInteraction', 'category');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ChatbotInteraction_category";');
  }
};
