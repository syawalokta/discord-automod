const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  ActionRowBuilder,
  ChannelType
} = require('discord.js');

const Product =
  require('../../models/Product');

const StoreConfig =
  require('../../models/StoreConfig');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('product')
      .setDescription('Manage products')

      .addSubcommand(sub =>
        sub

          .setName('add')
          .setDescription('Add product')

          .addStringOption(option =>
            option

              .setName('name')
              .setDescription('Product name')
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('content')
              .setDescription('Product content')
              .setRequired(true)
          )
      )

    .addSubcommand(sub =>
  sub

    .setName('edit')
    .setDescription('Edit product')

    .addIntegerOption(option =>
      option

        .setName('id')
        .setDescription('Product ID')
        .setRequired(true)
    )

    .addStringOption(option =>
      option

        .setName('name')
        .setDescription('New product name')
        .setRequired(false)
    )

    .addStringOption(option =>
      option

        .setName('content')
        .setDescription('New product content')
        .setRequired(false)
    )
)

    .addSubcommand(sub =>
  sub

    .setName('delete')
    .setDescription('Delete product')

    .addIntegerOption(option =>
      option

        .setName('id')
        .setDescription('Product ID')
        .setRequired(true)
    )
)

      .addSubcommand(sub =>
        sub

          .setName('list')
          .setDescription('View product list')
      )

    .addSubcommand(sub =>
  sub

    .setName('show')
    .setDescription('Show product panel')

    .addStringOption(option =>
      option

        .setName('message')
        .setDescription('Panel message')
        .setRequired(true)
    )

    .addChannelOption(option =>
  option

    .setName('channel')
    .setDescription('Target channel')
    .addChannelTypes(
      ChannelType.GuildText
    )
    .setRequired(false)
)
)

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    /*
     * ADD
     */

    if (sub === 'add') {

      const name =
        interaction.options.getString(
          'name'
        );

      const content =
        interaction.options.getString(
          'content'
        );

      const last =
        await Product.findOne({
          guildId:
            interaction.guild.id
        })
          .sort({
            productId: -1
          });

      const productId =
        last
          ? last.productId + 1
          : 1;

      await Product.create({

        guildId:
          interaction.guild.id,

        productId,

        name,

        content

      });

      return interaction.reply({

        content:
          `✅ Product **${name}** berhasil ditambahkan.\n\nID: **#${productId}**`,

        ephemeral: true

      });

    }

    /*
 * EDIT
 */

if (sub === 'edit') {

  const id =
    interaction.options.getInteger(
      'id'
    );

  const name =
    interaction.options.getString(
      'name'
    );

  const content =
    interaction.options.getString(
      'content'
    );

  const product =
    await Product.findOne({

      guildId:
        interaction.guild.id,

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

  if (!name && !content) {

    return interaction.reply({

      content:
        '❌ Berikan nama atau content baru.',

      ephemeral: true

    });

  }

  if (name)
    product.name = name;

  if (content)
    product.content = content;

  await product.save();

  return interaction.reply({

    content:
      `✅ Product #${id} berhasil diupdate.`,

    ephemeral: true

  });

}

    /*
 * DELETE
 */

if (sub === 'delete') {

  const id =
    interaction.options.getInteger(
      'id'
    );

  const product =
    await Product.findOne({

      guildId:
        interaction.guild.id,

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

  await product.deleteOne();

  return interaction.reply({

    content:
      `✅ Product #${id} berhasil dihapus.`,

    ephemeral: true

  });

}
    
    // LIST
    if (sub === 'list') {

      const products =
        await Product.find({
          guildId:
            interaction.guild.id
        }).sort({
          productId: 1
        });

      if (!products.length) {

        return interaction.reply({

          content:
            '❌ Belum ada product.',

          ephemeral: true

        });

      }

      const embed =
        new EmbedBuilder()

          .setTitle(
            '📦 Product List'
          )

          .setColor(
            0x5865F2
          )

          .setDescription(

            products.map(product =>

              `**#${product.productId}** • ${product.name}`

            ).join('\n')

          );

      return interaction.reply({

        embeds: [
          embed
        ],

        ephemeral: true

      });

    }

    //show
    if (sub === 'show') {

  const message =
    interaction.options.getString(
      'message'
    );

  const channel =
    interaction.options.getChannel(
      'channel'
    ) ||
    interaction.channel;

  const products =
    await Product.find({
      guildId:
        interaction.guild.id
    }).sort({
      productId: 1
    });

  if (!products.length) {

    return interaction.reply({
      content:
        '❌ Belum ada product.',
      ephemeral: true
    });

  }

  const menu =
    new StringSelectMenuBuilder()

      .setCustomId(
        'store_select'
      )

      .setPlaceholder(
        '📦 Pilih Produk'
      )

      .addOptions(

        products.map(product => ({

          label:
            product.name,

          description:
            `ID #${product.productId}`,

          value:
            product.productId.toString()

        }))

      );

  const row =
    new ActionRowBuilder()
      .addComponents(menu);

  const embed =
    new EmbedBuilder()

      .setTitle(
        '📦 Store'
      )

      .setDescription(
        message
      )

      .setColor(
        0x5865F2
      );

  const panel =
    await channel.send({

      embeds: [
        embed
      ],

      components: [
        row
      ]

    });

  await StoreConfig.findOneAndUpdate({

    guildId:
      interaction.guild.id

  }, {

    guildId:
      interaction.guild.id,

    channelId:
      channel.id,

    messageId:
      panel.id

  }, {

    upsert: true

  });

  return interaction.reply({

    content:
      '✅ Store panel berhasil dibuat.',

    ephemeral: true

  });

    }

  }

};