const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const {
  joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');

const VoiceStay = require('../../models/VoiceStay');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stayvc')
    .setDescription('24/7 voice mode')

    .addSubcommand(sub =>
      sub
        .setName('enable')
        .setDescription('enable 24/7 vc')
    )

    .addSubcommand(sub =>
      sub
        .setName('disable')
        .setDescription('disable 24/7 vc')
    )

    .addSubcommand(sub =>
      sub
        .setName('status')
        .setDescription('check vc status')
    )

    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator
    ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    const memberVC =
      interaction.member.voice.channel;

    if (sub === 'enable') {

      if (!memberVC) {
        return interaction.reply({
          content:
            '❌ join voice channel terlebih dahulu',
          ephemeral: true
        });
      }

      await VoiceStay.findOneAndUpdate(
        {
          guildId: interaction.guild.id
        },
        {
          guildId: interaction.guild.id,
          channelId: memberVC.id
        },
        {
          upsert: true
        }
      );

      joinVoiceChannel({
        channelId: memberVC.id,
        guildId: interaction.guild.id,
        adapterCreator:
          interaction.guild.voiceAdapterCreator,
        selfDeaf: true
      });

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🎙️ 24/7 Voice Enabled')
        .setDescription(
          `bot sekarang stay di ${memberVC}`
        );

      return interaction.reply({
        embeds: [embed]
      });

    }

    if (sub === 'disable') {

      await VoiceStay.deleteOne({
        guildId: interaction.guild.id
      });

      const connection =
        getVoiceConnection(
          interaction.guild.id
        );

      if (connection)
        connection.destroy();

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ED4245')
            .setTitle(
              '🛑 24/7 Voice Disabled'
            )
        ]
      });

    }

    if (sub === 'status') {

      const data =
        await VoiceStay.findOne({
          guildId: interaction.guild.id
        });

      if (!data) {

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#ED4245')
              .setTitle(
                '❌ 24/7 Voice Not Enabled'
              )
          ]
        });

      }

      const channel =
        interaction.guild.channels.cache.get(
          data.channelId
        );

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#57F287')
            .setTitle(
              '🎙️ 24/7 Voice Status'
            )
            .addFields(
              {
                name: 'Channel',
                value:
                  channel
                    ? `${channel}`
                    : 'Unknown'
              }
            )
        ]
      });

    }

  }
};