const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addprem')
    .setDescription('Add premium user')

    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Target user')
        .setRequired(true)
    )

    .addIntegerOption(option =>
      option
        .setName('duration')
        .setDescription('Duration in days (0 = lifetime)')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
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

    const duration =
      interaction.options.getInteger(
        'duration'
      );

    let premiumUntil = null;

    if (duration > 0) {

      premiumUntil = new Date();

      premiumUntil.setDate(
        premiumUntil.getDate() +
        duration
      );

    }

    await User.findOneAndUpdate(
      {
        userId: target.id
      },
      {
        role: 'premium',
        premiumUntil
      },
      {
        upsert: true
      }
    );

    const embed =
      new EmbedBuilder()
        .setTitle(
          '⭐ Premium Added'
        )
        .setColor(
          0xFEE75C
        )
        .addFields(
          {
            name: 'User',
            value: `<@${target.id}>`,
            inline: true
          },
          {
            name: 'Duration',
            value:
              duration === 0
                ? 'Lifetime'
                : `${duration} Days`,
            inline: true
          }
        );

    return interaction.reply({
      embeds: [embed]
    });

  }
};