const {
  EmbedBuilder
} = require('discord.js');

const Store =
  require('../../models/Store');

const createMenu =
  require('./utils/createMenu');

module.exports = {

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    const title =
      interaction.options.getString(
        'title'
      );

    const description =
      interaction.options.getString(
        'description'
      );

    const image =
      interaction.options.getAttachment(
        'image'
      );

    /*
     * CHECK STORE
     */

    const exists =
      await Store.findOne({

        guildId:
          interaction.guild.id,

        channelId:
          channel.id

      });

    if (exists) {

      return interaction.reply({

        content:
          `❌ Store pada ${channel} sudah dibuat.`,

        ephemeral: true

      });

    }

    /*
     * CREATE MENU
     */

    const row =
      await createMenu(

        interaction.guild.id,

        channel.id

      );

    /*
     * EMBED
     */

    const embed =
      new EmbedBuilder()

        .setTitle(
          title
        )

        .setDescription(
          description
        )

        .setColor(
          0x5865F2
        );

    if (image) {

      embed.setImage(
        image.url
      );

    }

    /*
     * SEND PANEL
     */

    const panel =
      await channel.send({

        embeds: [
          embed
        ],

        components: [
          row
        ]

      });

    /*
     * SAVE STORE
     */

    await Store.create({

      guildId:
        interaction.guild.id,

      channelId:
        channel.id,

      messageId:
        panel.id,

      title,

      description,

      image:
        image?.url || null

    });

    return interaction.reply({

      content:
        `✅ Store berhasil dibuat pada ${channel}.`,

      ephemeral: true

    });

  }

};