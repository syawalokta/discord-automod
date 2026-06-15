const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

const getUser = require('../../utils/getUser');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Lihat profile fishing'),

  async execute(interaction) {
    const user = await getUser(
      interaction.user.id
    );

    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setTitle(`🎣 ${interaction.user.username}`)
      .addFields(
        {
          name: '🎣 Rod',
          value: user.rod,
          inline: true,
        },
        {
          name: '🪱 Worm Bait',
          value: user.baits.worm.toString(),
          inline: true,
        },
        {
          name: '🦐 Shrimp Bait',
          value: user.baits.shrimp.toString(),
          inline: true,
        },
        {
          name: '✨ Premium Bait',
          value: user.baits.premium.toString(),
          inline: true,
        },
        {
          name: '🌌 Mythic Bait',
          value: user.baits.mythic.toString(),
          inline: true,
        }
      );

    await interaction.reply({
      embeds: [embed],
    });
  },
};