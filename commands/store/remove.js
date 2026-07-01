const Store =
  require('../../models/Store');

const Product =
  require('../../models/Product');

module.exports = {

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    const store =
      await Store.findOne({

        guildId:
          interaction.guild.id,

        channelId:
          channel.id

      });

    if (!store) {

      return interaction.reply({

        content:
          `❌ Tidak ada store pada ${channel}.`,

        ephemeral: true

      });

    }

    /*
     * DELETE MESSAGE
     */

    try {

      const targetChannel =
        await interaction.guild.channels.fetch(
          store.channelId
        );

      const message =
        await targetChannel.messages.fetch(
          store.messageId
        );

      await message.delete();

    } catch (_) {}

    /*
     * DELETE STORE
     */

    await Store.deleteOne({

      _id:
        store._id

    });

    /*
     * DELETE PRODUCTS
     */

    await Product.deleteMany({

      guildId:
        interaction.guild.id,

      channelId:
        channel.id

    });

    return interaction.reply({

      content:
        `✅ Store pada ${channel} berhasil dihapus.`,

      ephemeral: true

    });

  }

};