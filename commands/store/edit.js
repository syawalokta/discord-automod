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

    if (
      !name &&
      !emoji &&
      !description &&
      !content
    ) {

      return interaction.reply({

        content:
          '❌ Tidak ada data yang diubah.',

        ephemeral: true

      });

    }

    if (name)
      product.name = name;

    if (emoji)
      product.emoji = emoji;

    if (description)
      product.description = description;

    if (content)
      product.content = content;

    await product.save();
    
    await updateStore(

    interaction.guild,
    channel.id

);

    // updateStore(interaction.guild.id, channel.id);

    return interaction.reply({

      content:
`✅ Product berhasil diupdate.

📦 ID : #${product.productId}
${product.emoji} Nama : ${product.name}
📝 Deskripsi : ${product.description}`,

      ephemeral: true

    });

  }

};