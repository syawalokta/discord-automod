const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const ReactionRole = require('../../models/ReactionRole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('manage reaction roles')

    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('add reaction role')

        .addStringOption(opt =>
          opt
            .setName('message_id')
            .setDescription('message id')
            .setRequired(true)
        )

        .addStringOption(opt =>
          opt
            .setName('emoji')
            .setDescription('emoji')
            .setRequired(true)
        )

        .addRoleOption(opt =>
          opt
            .setName('role')
            .setDescription('select role')
            .setRequired(true)
        )

        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('target channel')
            .setRequired(false)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('remove reaction role')

        .addStringOption(opt =>
          opt
            .setName('message_id')
            .setDescription('message id')
            .setRequired(true)
        )

        .addStringOption(opt =>
          opt
            .setName('emoji')
            .setDescription('emoji')
            .setRequired(true)
        )
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageRoles
    ),

  async execute(interaction) {

    const sub = interaction.options.getSubcommand();

    if (sub === 'add') {

      const messageId =
        interaction.options.getString('message_id');

      const emoji =
        interaction.options.getString('emoji');

      const role =
        interaction.options.getRole('role');

      const channel =
        interaction.options.getChannel('channel') ||
        interaction.channel;

      try {

        const message =
          await channel.messages.fetch(messageId);

        await message.react(emoji);

        await ReactionRole.create({
          guildId: interaction.guild.id,
          channelId: channel.id,
          messageId,
          emoji,
          roleId: role.id
        });

        return interaction.reply({
          content:
            `✅ reaction role created\nemoji: ${emoji}\nrole: ${role}`,
          ephemeral: true
        });

      } catch (err) {

        return interaction.reply({
          content: '❌ failed to setup reaction role',
          ephemeral: true
        });

      }

    }

    if (sub === 'remove') {

      const messageId =
        interaction.options.getString('message_id');

      const emoji =
        interaction.options.getString('emoji');

      await ReactionRole.findOneAndDelete({
        messageId,
        emoji
      });

      return interaction.reply({
        content: '✅ reaction role removed',
        ephemeral: true
      });

    }

  }
};