class ChatbotInteractionDTO {
  constructor(interaction) {
    if (!interaction) throw new Error('Interaction entity is required.');
    this.interaction_id = interaction.interaction_id;
    this.message = interaction.message;
    this.response = interaction.response;
  }
}

module.exports = ChatbotInteractionDTO;
