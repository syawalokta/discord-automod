const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} = require('discord.js');

const remove =
  require('./remove');

module.exports = {

  data:
    new SlashCommandBuilder()

      .setName('store')
      .setDescription('Manage store')

      .addSubcommand(sub =>
        sub

          .setName('remove')
          .setDescription('Remove a store')

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

      .setDefaultMemberPermissions(
        PermissionFlagsBits.Administrator
      ),

  async execute(interaction) {

    const sub =
      interaction.options.getSubcommand();

    switch (sub) {

      case 'remove':
        return remove.execute(
          interaction
        );

    }

  }

};