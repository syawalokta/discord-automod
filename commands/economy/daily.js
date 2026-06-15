const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

const getUser = require('../../utils/getUser');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily reward'),

  async execute(interaction) {
    const user = await getUser(interaction.user.id);

    const now = Date.now();

    if (
      user.lastDaily &&
      now - user.lastDaily.getTime() < 86400000
    ) {
      const remaining =
        86400000 - (now - user.lastDaily.getTime());

      const hours = Math.floor(
        remaining / 1000 / 60 / 60
      );

      const minutes = Math.floor(
        (remaining / 1000 / 60) % 60
      );

      return interaction.reply({
        content: `⏳ lu udah claim daily.\nCoba lagi dalam **${hours} jam ${minutes} menit**.`,
        ephemeral: true,
      });
    }

    const reward = 500;

    user.wallet += reward;
    user.lastDaily = new Date();

    await user.save();

    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('🎁 Daily Reward')
      .setDescription(
        `lu dapet **${reward.toLocaleString()} TPC** 🪙`
      );

    await interaction.reply({
      embeds: [embed],
    });
  },
};