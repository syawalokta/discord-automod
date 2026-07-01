const {
  EmbedBuilder
} = require('discord.js');

const Store =
  require('../../../models/Store');

const createMenu =
  require('./createMenu');

module.exports = async function updateStore(
  guild,
  channelId
) {

  const store =
    await Store.findOne({

      guildId:
        guild.id,

      channelId

    });

  if (!store)
    return;

  const channel =
    await guild.channels.fetch(
      store.channelId
    ).catch(() => null);

  if (!channel)
    return;

  const message =
    await channel.messages.fetch(
      store.messageId
    ).catch(() => null);

  if (!message)
    return;

  const row =
    await createMenu(

      guild.id,

      channelId

    );

  const embed =
    new EmbedBuilder()

      .setTitle(
        store.title
      )

      .setDescription(
        store.description
      )

      .setColor(
        0x5865F2
      );

  if (store.image) {

    embed.setImage(
      store.image
    );

  }

  await message.edit({

    embeds: [
      embed
    ],

    components: [
      row
    ]

  });

};