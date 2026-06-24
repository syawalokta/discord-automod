const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} = require('discord.js');

const InviteLog =
  require('../../models/InviteLog');

const User =
  require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invitelog')
    .setDescription('Invite Log System')

    .addSubcommand(sub =>
      sub
        .setName('add')
        .setDescription('Create invite log')

        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Invite log message')
            .setRequired(true)
        )

        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Target channel')
            .addChannelTypes(
              ChannelType.GuildText
            )
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
  sub
    .setName('edit')
    .setDescription('Edit invite log')

    .addStringOption(option =>
      option
        .setName('message')
        .setDescription('New invite log message')
        .setRequired(true)
    )

    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('New target channel')
        .addChannelTypes(
          ChannelType.GuildText
        )
        .setRequired(false)
    )
)

    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('Remove invite log')
    )

    .addSubcommand(sub =>
      sub
        .setName('status')
        .setDescription('View invite log status')
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    if (
      interaction.user.id !==
      process.env.OWNER_ID
    ) {

      const user =
        await User.findOne({
          userId:
            interaction.user.id
        });

      if (
        user?.role !== 'premium'
      ) {
        return interaction.reply({
          content:
            '⭐ Premium only.',
          ephemeral: true
        });
      }
    }

    const sub =
      interaction.options.getSubcommand();

    if (sub === 'add') {

      const message =
        interaction.options.getString(
          'message'
        );

      const channel =
        interaction.options.getChannel(
          'channel'
        );

      await InviteLog.findOneAndUpdate(
        {
          guildId:
            interaction.guild.id
        },
        {
          guildId:
            interaction.guild.id,

          channelId:
            channel.id,

          message
        },
        {
          upsert: true
        }
      );

      return interaction.reply({
        content:
          `✅ Invite log set to ${channel}`,
        ephemeral: true
      });

    }

    if (sub === 'edit') {

  const config =
    await InviteLog.findOne({
      guildId:
        interaction.guild.id
    });

  if (!config) {

    return interaction.reply({
      content:
        '❌ Invite log belum dibuat.',
      ephemeral: true
    });

  }

  const message =
    interaction.options.getString(
      'message'
    );

  const channel =
    interaction.options.getChannel(
      'channel'
    );

  config.message = message;

  if (channel) {
    config.channelId =
      channel.id;
  }

  await config.save();

  return interaction.reply({
    content:
      '✅ Invite log berhasil diupdate.',
    ephemeral: true
  });

    }

    if (sub === 'remove') {

      await InviteLog.deleteOne({
        guildId:
          interaction.guild.id
      });

      return interaction.reply({
        content:
          '✅ Invite log removed.',
        ephemeral: true
      });

    }

    if (sub === 'status') {

      const config =
        await InviteLog.findOne({
          guildId:
            interaction.guild.id
        });

      if (!config) {

        return interaction.reply({
          content:
            '❌ Invite log not configured.',
          ephemeral: true
        });

      }

      const embed =
        new EmbedBuilder()
          .setTitle(
            '📨 Invite Log Status'
          )
          .setColor(
            0x5865F2
          )
          .addFields(
            {
              name: 'Channel',
              value:
                `<#${config.channelId}>`
            },
            {
              name: 'Message',
              value:
                config.message
            }
          );

      return interaction.reply({
        embeds: [embed]
      });

    }

  }
};