const {
  joinVoiceChannel
} = require('@discordjs/voice');

const VoiceStay =
  require('../models/VoiceStay');

module.exports = {
  name: 'clientReady',
  once: true,

  async execute(client) {

    const data =
      await VoiceStay.find();

    for (const vc of data) {

      const guild =
        client.guilds.cache.get(
          vc.guildId
        );

      if (!guild) continue;

      const channel =
        guild.channels.cache.get(
          vc.channelId
        );

      if (!channel) continue;

      try {

        joinVoiceChannel({
          channelId: channel.id,
          guildId: guild.id,
          adapterCreator:
            guild.voiceAdapterCreator,
          selfDeaf: true
        });

        console.log(
          `🎙️ Reconnected to ${guild.name}`
        );

      } catch (err) {
        console.log(err);
      }

    }

  }
};