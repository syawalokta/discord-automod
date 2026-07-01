const Product = require('../../models/Product');
const updateStore = require('./utils/updateStore');

module.exports = {

  async execute(interaction) {

    const channel =
      interaction.options.getChannel(
        'channel'
      );

    const id =
      interaction.options.getInteger(
        'id'
      );

    const product =
      await Product.findOne({

        guildId:
          interaction.guild.id,

        channelId:
          channel.id,

        productId:
          id

      });

    if (!product) {

      return interaction.reply({

        content:
          '❌ Product tidak ditemukan.',

        ephemeral: true

      });

    }

    const productName =
      product.name;

    const emoji =
      product.emoji;

    await product.deleteOne();

    await updateStore(

    interaction.guild,

    channel.id
    
    );

    // updateStore(interaction.guild.id, channel.id);

    return interaction.reply({

      content:
`✅ Product berhasil dihapus.

📦 ID : #${id}
${emoji} Nama : ${productName}`,

      ephemeral: true

    });

  }

};