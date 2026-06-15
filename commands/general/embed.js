const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('manage announcement embeds')

    .addSubcommand(sub =>
      sub
        .setName('create')
        .setDescription('create announcement embed')
        .addStringOption(opt =>
          opt
            .setName('message')
            .setDescription('announcement content')
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
        .setName('edit')
        .setDescription('edit announcement embed')
        .addStringOption(opt =>
          opt
            .setName('message_id')
            .setDescription('message id')
            .setRequired(true)
        )
        .addStringOption(opt =>
          opt
            .setName('message')
            .setDescription('new content')
            .setRequired(true)
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('channel where embed exists')
            .setRequired(false)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName('delete')
        .setDescription('delete announcement embed')
        .addStringOption(opt =>
          opt
            .setName('message_id')
            .setDescription('message id')
            .setRequired(true)
        )
        .addChannelOption(opt =>
          opt
            .setName('channel')
            .setDescription('channel where embed exists')
            .setRequired(false)
        )
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageGuild
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    const buildEmbed = (content) =>
      new EmbedBuilder()
        .setColor('#00D4FF')
        .setAuthor({
          name: '📢 Announcement',
          iconURL: interaction.guild.iconURL(),
        })
        .setDescription(content)
        .setThumbnail(
          interaction.guild.iconURL({ dynamic: true })
        )
        .setFooter({
          text: `Posted by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

    if (sub === 'create') {
      const content =
        interaction.options.getString('message');

      const channel =
        interaction.options.getChannel('channel') ||
        interaction.channel;

      const msg = await channel.send({
        embeds: [buildEmbed(content)],
      });

      return interaction.reply({
        content: `✅ Announcement sent in ${channel}\n🆔 ${msg.id}`,
        ephemeral: true,
      });
    }

    if (sub === 'edit') {
      const messageId =
        interaction.options.getString('message_id');

      const content =
        interaction.options.getString('message');

      const channel =
        interaction.options.getChannel('channel') ||
        interaction.channel;

      try {
        const message =
          await channel.messages.fetch(messageId);

        await message.edit({
          embeds: [buildEmbed(content)],
        });

        return interaction.reply({
          content: '✅ Embed updated.',
          ephemeral: true,
        });
      } catch {
        return interaction.reply({
          content: '❌ Message not found.',
          ephemeral: true,
        });
      }
    }

    if (sub === 'delete') {
      const messageId =
        interaction.options.getString('message_id');

      const channel =
        interaction.options.getChannel('channel') ||
        interaction.channel;

      try {
        const message =
          await channel.messages.fetch(messageId);

        await message.delete();

        return interaction.reply({
          content: '✅ Embed deleted.',
          ephemeral: true,
        });
      } catch {
        return interaction.reply({
          content: '❌ Message not found.',
          ephemeral: true,
        });
      }
    }
  },
};