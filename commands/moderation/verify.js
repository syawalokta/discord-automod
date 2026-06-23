const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType
} = require('discord.js');

const VerifyConfig = require('../../models/VerifyConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Setup verification system')

    .addSubcommand(sub =>
      sub
        .setName('setup')
        .setDescription('Setup verification panel')

        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Verification message')
            .setRequired(true)
        )

        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Verified role')
            .setRequired(true)
        )

        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Target channel')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    if (sub !== 'setup') return;

    const message =
      interaction.options.getString('message');

    const role =
      interaction.options.getRole('role');

    const channel =
      interaction.options.getChannel('channel') ||
      interaction.channel;

    await VerifyConfig.findOneAndUpdate(
      {
        guildId: interaction.guild.id
      },
      {
        guildId: interaction.guild.id,
        roleId: role.id,
        channelId: channel.id
      },
      {
        upsert: true
      }
    );

    const embed = new EmbedBuilder()
      .setTitle('🔐 Server Verification')
      .setDescription(message)
      .setColor('#5865F2');

    const button =
      new ButtonBuilder()
        .setLabel('Verify')
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://verify.topinzpedia.web.id/auth/${interaction.guild.id}`
        );

    const row =
      new ActionRowBuilder()
        .addComponents(button);

    await channel.send({
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content:
        `✅ Verification panel created in ${channel}`,
      ephemeral: true
    });

  }
};