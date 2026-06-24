const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listprem')
    .setDescription('List premium users'),

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

    const users =
      await User.find({
        role: 'premium'
      });

    if (!users.length) {
      return interaction.reply({
        content:
          '❌ No premium users found.'
      });
    }

    const text =
      users.map(user => {

        const expiry =
          user.premiumUntil
            ? `<t:${Math.floor(user.premiumUntil.getTime() / 1000)}:R>`
            : 'Lifetime';

        return `• <@${user.userId}> — ${expiry}`;

      }).join('\n');

    const embed =
      new EmbedBuilder()
        .setTitle(
          '⭐ Premium Users'
        )
        .setColor(
          0xFEE75C
        )
        .setDescription(text);

    return interaction.reply({
      embeds: [embed]
    });

  }
};