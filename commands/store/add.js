const Product = require('../../models/Product');
const Store = require('../../models/Store');
const updateStore = require('./utils/updateStore');

module.exports = {

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    const name =
      interaction.options.getString(
        'name'
      );

    const emoji =
      interaction.options.getString(
        'emoji'
      );

    const description =
      interaction.options.getString(
        'description'
      );

    const content =
      interaction.options.getString(
        'content'
      );

    /*
     * CHECK STORE
     */

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
          `❌ Belum ada store pada ${channel}.\n\nBuat terlebih dahulu menggunakan \`/product show\`.`,

        ephemeral: true

      });

    }

    /*
     * GENERATE PRODUCT ID
     */

    const lastProduct =
      await Product.findOne({

        guildId:
          interaction.guild.id,

        channelId:
          channel.id

      }).sort({

        productId: -1

      });

    const productId =
      lastProduct
        ? lastProduct.productId + 1
        : 1;

    /*
     * SAVE PRODUCT
     */

    const product =
      await Product.create({

        guildId:
          interaction.guild.id,

        channelId:
          channel.id,

        productId,

        name,

        emoji,

        description,

        content

      });


    await updateStore(
      interaction.guild, 
      channel.id
    );

    /*
     * RESPONSE
     */

    return interaction.reply({

      content:
`✅ Product berhasil ditambahkan.

📦 ID : #${product.productId}
${product.emoji} Nama : ${product.name}
📝 Deskripsi : ${product.description}
📍 Channel : ${channel}`,

      ephemeral: true

    });

  }

};