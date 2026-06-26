const {
  EmbedBuilder
} = require('discord.js');

const Product =
  require('../../models/Product');

module.exports = {

  customId:
    'store_select',

  async execute(interaction) {

    const productId =
      Number(
        interaction.values[0]
      );

    const product =
      await Product.findOne({

        guildId:
          interaction.guild.id,

        productId

      });

    if (!product) {

      return interaction.reply({

        content:
          '❌ Product tidak ditemukan.',

        ephemeral: true

      });

    }

    const embed =
      new EmbedBuilder()

        .setTitle(
          `📦 ${product.name}`
        )

        .setDescription(
          product.content
        )

        .setColor(
          0x5865F2
        );

    return interaction.reply({

      embeds: [
        embed
      ],

      ephemeral: true

    });

  }

};