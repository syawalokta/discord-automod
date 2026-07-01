const {
  StringSelectMenuBuilder,
  ActionRowBuilder
} = require('discord.js');

const Product =
  require('../../../models/Product');

module.exports = async function createMenu(
  guildId,
  channelId
) {

  const products =
    await Product.find({

      guildId,

      channelId

    }).sort({

      productId: 1

    });

  const menu =
    new StringSelectMenuBuilder()

      .setCustomId(
        `product_select:${channelId}`
      )

      .setPlaceholder(
        '📦 Pilih Produk'
      );

  /*
   * EMPTY
   */

  if (!products.length) {

    menu.addOptions({

      label:
        'Belum ada product',

      description:
        'Tambahkan product terlebih dahulu.',

      value:
        'empty',

      emoji:
        '📦'

    });

  }

  /*
   * PRODUCTS
   */

  else {

    menu.addOptions(

      products.map(product => ({

        label:
          product.name,

        description:
          product.description,

        emoji:
          product.emoji,

        value:
          product.productId.toString()

      }))

    );

  }

  return new ActionRowBuilder()

    .addComponents(menu);

};