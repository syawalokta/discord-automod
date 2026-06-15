const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

const getUser = require('../../utils/getUser');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your balance'),

  async execute(interaction) {
    const user = await getUser(interaction.user.id);

    const total = user.wallet + user.bank;

    const embed = new EmbedBuilder()
      .setColor('Gold')
      .setTitle('🪙 Topinz Coin Balance')
      .addFields(
        {
          name: '💰 Wallet',
          value: `${user.wallet.toLocaleString()} TPC`,
          inline: true,
        },
        {
          name: '🏦 Bank',
          value: `${user.bank.toLocaleString()} TPC`,
          inline: true,
        },
        {
          name: '📈 Total',
          value: `${total.toLocaleString()} TPC`,
          inline: false,
        }
      );

    await interaction.reply({
      embeds: [embed],
    });
  },
};