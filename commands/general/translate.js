// /commands/general/translate.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const translate = require('@vitalets/google-translate-api');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate text to a different language.')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Text to translate')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('to')
        .setDescription('Language code (e.g. en, fr, hi)')
        .setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const toLang = interaction.options.getString('to');

    try {
      const res = await translate(text, { to: toLang });

      const embed = new EmbedBuilder()
        .setTitle('🌐 Translation')
        .addFields(
          { name: 'Original', value: text },
          { name: `Translated (${toLang})`, value: res.text }
        )
        .setColor('Green');

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ Failed to translate.', ephemeral: true });
    }
  }
};
