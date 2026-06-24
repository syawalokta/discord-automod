const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delprem')
    .setDescription('Remove premium user')

    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Target user')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (
      interaction.user.id !==
      process.env.OWNER_ID
    ) {
      return interaction.reply({
        content: '❌ Owner only.',
        ephemeral: true
      });
    }

    const target =
      interaction.options.getUser(
        'user'
      );

    await User.findOneAndUpdate(
      {
        userId: target.id
      },
      {
        role: 'user',
        premiumUntil: null
      }
    );

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(
            '❌ Premium Removed'
          )
          .setColor(
            0xED4245
          )
          .setDescription(
            `<@${target.id}> is no longer premium.`
          )
      ]
    });

  }
};