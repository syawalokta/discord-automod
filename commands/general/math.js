// /commands/general/math.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const math = require('mathjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('math')
    .setDescription('Calculate a math expression.')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('Enter the math expression')
        .setRequired(true)),
  async execute(interaction) {
    const expr = interaction.options.getString('expression');

    try {
      const result = math.evaluate(expr);

      const embed = new EmbedBuilder()
        .setTitle('🧮 Math Result')
        .addFields(
          { name: 'Expression', value: `\`${expr}\`` },
          { name: 'Result', value: `\`${result}\`` }
        )
        .setColor('Blue');

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      await interaction.reply({ content: '❌ Invalid expression.', ephemeral: true });
    }
  }
};
