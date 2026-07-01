const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require('discord.js');

const add = require('./add');
const edit = require('./edit');
const del = require('./delete');
const list = require('./list');
const show = require('./show');
const view = require('./view');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('product')
      .setDescription('Manage store products')

      /*
       * ADD
       */

      .addSubcommand(sub =>
        sub

          .setName('add')
          .setDescription('Add product')

          .addChannelOption(option =>
            option

              .setName('channel')
              .setDescription('Store channel')
              .addChannelTypes(
                ChannelType.GuildText
              )
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('name')
              .setDescription('Product name')
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('emoji')
              .setDescription('Emoji')
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('description')
              .setDescription('Short description')
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('content')
              .setDescription('Product content')
              .setRequired(true)
          )
      )

      /*
       * EDIT
       */

      .addSubcommand(sub =>
        sub

          .setName('edit')
          .setDescription('Edit product')

          .addChannelOption(option =>
            option

              .setName('channel')
              .setDescription('Store channel')
              .addChannelTypes(
                ChannelType.GuildText
              )
              .setRequired(true)
          )

          .addIntegerOption(option =>
            option

              .setName('id')
              .setDescription('Product ID')
              .setRequired(true)
          )

          .addStringOption(option =>
            option
              .setName('name')
              .setDescription('New name')
          )

          .addStringOption(option =>
            option
              .setName('emoji')
              .setDescription('New emoji')
          )

          .addStringOption(option =>
            option
              .setName('description')
              .setDescription('New description')
          )

          .addStringOption(option =>
            option
              .setName('content')
              .setDescription('New content')
          )
      )

      /*
       * DELETE
       */

      .addSubcommand(sub =>
        sub

          .setName('delete')
          .setDescription('Delete product')

          .addChannelOption(option =>
            option

              .setName('channel')
              .setDescription('Store channel')
              .addChannelTypes(
                ChannelType.GuildText
              )
              .setRequired(true)
          )

          .addIntegerOption(option =>
            option

              .setName('id')
              .setDescription('Product ID')
              .setRequired(true)
          )
      )

      /*
       * LIST
       */

      .addSubcommand(sub =>
        sub

          .setName('list')
          .setDescription('View product list')

          .addChannelOption(option =>
            option

              .setName('channel')
              .setDescription('Store channel')
              .addChannelTypes(
                ChannelType.GuildText
              )
              .setRequired(true)
          )
      )

      /*
       * SHOW
       */

      .addSubcommand(sub =>
        sub

          .setName('show')
          .setDescription('Create store panel')

          .addChannelOption(option =>
            option

              .setName('channel')
              .setDescription('Store channel')
              .addChannelTypes(
                ChannelType.GuildText
              )
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('title')
              .setDescription('Panel title')
              .setRequired(true)
          )

          .addStringOption(option =>
            option

              .setName('description')
              .setDescription('Panel description')
              .setRequired(true)
          )

          .addAttachmentOption(option =>
            option

              .setName('image')
              .setDescription('Banner image')
          )
      )

      /*
       * VIEW
       */

      .addSubcommand(sub =>
        sub

          .setName('view')
          .setDescription('View product')

          .addChannelOption(option =>
            option

              .setName('channel')
              .setDescription('Store channel')
              .addChannelTypes(
                ChannelType.GuildText
              )
              .setRequired(true)
          )

          .addIntegerOption(option =>
            option

              .setName('id')
              .setDescription('Product ID')
              .setRequired(true)
          )
      )

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    const routes = {

      add,

      edit,

      delete: del,

      list,

      show,

      view

    };

    const handler =
      routes[sub];

    if (!handler) {

      return interaction.reply({

        content:
          '❌ Unknown subcommand.',

        ephemeral: true

      });

    }

    return handler.execute(
      interaction
    );

  }

};