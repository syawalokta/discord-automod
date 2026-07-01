const {
  EmbedBuilder
} = require('discord.js');

const Product =
  require('../../models/Product');

const Store =
  require('../../models/Store');

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

    const products =
      await Product.find({

        guildId:
          interaction.guild.id,

        channelId:
          channel.id

      }).sort({

        productId: 1

      });

    if (!products.length) {

      return interaction.reply({

        content:
          `❌ Belum ada product pada ${channel}.`,

        ephemeral: true

      });

    }

    const embed =
      new EmbedBuilder()

        .setTitle(
          `📦 ${store.title}`
        )

        .setColor(
          0x5865F2
        )

        .setDescription(

          products.map(product =>

`### ${product.emoji} ${product.name}
> ${product.description}`

          ).join('\n\n')

        )

        .setFooter({

          text:
            `${products.length} Products`

        });

    return interaction.reply({

      embeds: [
        embed
      ],

      ephemeral: true

    });

  }

};