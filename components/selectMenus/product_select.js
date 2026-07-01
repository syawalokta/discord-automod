const {
  EmbedBuilder
} = require('discord.js');

const Product =
  require('../../models/Product');

module.exports = {

  customId:
    'product_select',

  async execute(interaction) {

    const channelId =
      interaction.customId.split(':')[1];

    const value =
      interaction.values[0];

    /*
     * EMPTY
     */

    if (value === 'empty') {

      return interaction.reply({

        content:
          '❌ Belum ada product pada store ini.',

        ephemeral: true

      });

    }

    /*
     * FIND PRODUCT
     */

    const product =
      await Product.findOne({

        guildId:
          interaction.guild.id,

        channelId,

        productId:
          Number(value)

      });

    if (!product) {

      return interaction.reply({

        content:
          '❌ Product tidak ditemukan.',

        ephemeral: true

      });

    }

    /*
     * RESPONSE
     */

    const embed =
      new EmbedBuilder()

        .setTitle(
          `${product.emoji} ${product.name}`
        )

        .setDescription(
          product.content
        )

        .setColor(
          0x5865F2
        );

    await interaction.reply({

      embeds: [
        embed
      ],

      ephemeral: true

    });

  }

};