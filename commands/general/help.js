const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const categoryIcons = {
  admin: '⚙️',
  moderation: '🛡️',
  info: 'ℹ️',
  general: '🌐',
  owner: '👑',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Browse all available bot commands'),

  async execute(interaction) {
    const commandsPath = path.join(__dirname, '..');

    const folders = fs
      .readdirSync(commandsPath)
      .filter(folder =>
        fs.lstatSync(path.join(commandsPath, folder)).isDirectory()
      );

    const pages = [];

    for (const folder of folders) {
      const folderPath = path.join(commandsPath, folder);

      const files = fs
        .readdirSync(folderPath)
        .filter(file => file.endsWith('.js'));

      const commands = [];

      for (const file of files) {
        try {
          const command = require(path.join(folderPath, file));

          if (command.data?.name) {
            commands.push({
              name: command.data.name,
              description:
                command.data.description || 'No description provided.',
            });
          }
        } catch (err) {
          console.error(`Failed loading ${file}:`, err);
        }
      }

      if (!commands.length) continue;

      const icon = categoryIcons[folder] || '📁';

      const embed = new EmbedBuilder()
        .setTitle(
          `${icon} ${folder.charAt(0).toUpperCase() + folder.slice(1)} Commands`
        )
        .setDescription(
          commands
            .map(
              cmd =>
                `> **\`/${cmd.name}\`**\n> ${cmd.description}`
            )
            .join('\n\n')
        )
        .setColor(0x5865f2)
        .setThumbnail(interaction.client.user.displayAvatarURL());

      pages.push(embed);
    }

    if (!pages.length) {
      return interaction.reply({
        content: '❌ No commands found.',
        ephemeral: true,
      });
    }

    let page = 0;

    const getEmbed = () =>
      EmbedBuilder.from(pages[page]).setFooter({
        text: `Page ${page + 1}/${pages.length}`,
      });

    const getButtons = () =>
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('first')
          .setEmoji('⏮️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === 0),

        new ButtonBuilder()
          .setCustomId('prev')
          .setEmoji('◀️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === 0),

        new ButtonBuilder()
          .setCustomId('next')
          .setEmoji('▶️')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(page === pages.length - 1),

        new ButtonBuilder()
          .setCustomId('last')
          .setEmoji('⏭️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(page === pages.length - 1)
      );

    await interaction.reply({
      embeds: [getEmbed()],
      components: [getButtons()],
      ephemeral: true,
    });

    const message = await interaction.fetchReply();

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 300000,
    });

    collector.on('collect', async button => {
      if (button.user.id !== interaction.user.id) {
        return button.reply({
          content: '❌ This menu is not yours.',
          ephemeral: true,
        });
      }

      switch (button.customId) {
        case 'first':
          page = 0;
          break;

        case 'prev':
          page--;
          break;

        case 'next':
          page++;
          break;

        case 'last':
          page = pages.length - 1;
          break;
      }

      await button.update({
        embeds: [getEmbed()],
        components: [getButtons()],
      });
    });

    collector.on('end', async () => {
  try {
    await interaction.editReply({
      components: [],
    });
  } catch (err) {}
});
  },

  async run(message) {

    const commandsPath = path.join(__dirname, '..');

    const folders = fs
      .readdirSync(commandsPath)
      .filter(folder =>
        fs.lstatSync(
          path.join(commandsPath, folder)
        ).isDirectory()
      );

    const embed = new EmbedBuilder()
      .setTitle('📚 Help Menu')
      .setDescription(
        'Use slash commands `/` or server prefix commands.'
      )
      .setColor(0x5865f2)
      .setThumbnail(
        message.client.user.displayAvatarURL()
      );

    for (const folder of folders) {

      const folderPath =
        path.join(commandsPath, folder);

      const files =
        fs.readdirSync(folderPath)
          .filter(file =>
            file.endsWith('.js')
          );

      const commands = [];

      for (const file of files) {

        try {

          const command =
            require(
              path.join(
                folderPath,
                file
              )
            );

          if (command.data?.name) {

            commands.push(
              `\`${command.data.name}\``
            );

          }

        } catch (err) {}

      }

      if (!commands.length)
        continue;

      const icon =
        categoryIcons[folder] || '📁';

      embed.addFields({
        name:
          `${icon} ${folder.charAt(0).toUpperCase() + folder.slice(1)}`,
        value:
          commands.join(', '),
        inline: false
      });

    }

    return message.reply({
      embeds: [embed]
    });

  }
};