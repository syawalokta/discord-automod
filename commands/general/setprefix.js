const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const PrefixConfig =
  require('../../models/PrefixConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Set server prefix')

    .addStringOption(option =>
      option
        .setName('prefix')
        .setDescription('New prefix')
        .setRequired(true)
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const prefix =
      interaction.options.getString(
        'prefix'
      );

    if (prefix.length > 5) {
      return interaction.reply({
        content:
          '❌ Prefix maksimal 5 karakter.',
        ephemeral: true
      });
    }

    await PrefixConfig.findOneAndUpdate(
      {
        guildId:
          interaction.guild.id
      },
      {
        guildId:
          interaction.guild.id,

        prefix
      },
      {
        upsert: true
      }
    );

    return interaction.reply({
      content:
        `✅ Prefix berhasil diubah menjadi \`${prefix}\``
    });

  }
};