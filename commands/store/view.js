module.exports = {
  async execute(interaction) {
    return interaction.reply({
      content: '🚧 Fitur ini masih dalam pengembangan.',
      ephemeral: true
    });
  }
};