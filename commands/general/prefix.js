const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

const PrefixConfig =
  require('../../models/PrefixConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('Show current server prefix'),

  async execute(interaction) {

    const config =
      await PrefixConfig.findOne({
        guildId:
          interaction.guild.id
      });

    const prefix =
      config?.prefix || '!';

    const embed =
      new EmbedBuilder()
        .setTitle('⚙️ Server Prefix')
        .setDescription(
          `Current Prefix: \`${prefix}\``
        )
        .setColor('#5865F2');

    return interaction.reply({
      embeds: [embed]
    });

  },

  async run(message) {

    const config =
      await PrefixConfig.findOne({
        guildId:
          message.guild.id
      });

    const prefix =
      config?.prefix || '!';

    const embed =
      new EmbedBuilder()
        .setTitle('⚙️ Server Prefix')
        .setDescription(
          `Current Prefix: \`${prefix}\``
        )
        .setColor('#5865F2');

    return message.reply({
      embeds: [embed]
    });

  }
};