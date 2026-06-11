const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return await interaction.reply({ content: '❌ This command is not available.', ephemeral: true });
                }

                await command.execute(interaction, interaction.client);

            } else if (interaction.isButton()) {
                // Special case: allow message component collectors (like /help) to handle their own buttons
                if (interaction.message?.interaction?.user.id === interaction.user.id) return;

                const button = interaction.client.buttons?.get(interaction.customId);
                if (!button) {
                    console.error(`No button handler matching ${interaction.customId} was found.`);
                    return await interaction.reply({ content: '❌ This button is not working.', ephemeral: true });
                }

                await button.execute(interaction);

            } else if (interaction.isStringSelectMenu()) {
                const menu = interaction.client.selectMenus?.get(interaction.customId);
                if (!menu) {
                    console.error(`No select menu handler matching ${interaction.customId} was found.`);
                    return await interaction.reply({ content: '❌ This select menu is broken.', ephemeral: true });
                }

                await menu.execute(interaction);

            } else if (interaction.isModalSubmit()) {
                const modal = interaction.client.modals?.get(interaction.customId);
                if (!modal) {
                    console.error(`No modal handler matching ${interaction.customId} was found.`);
                    return await interaction.reply({ content: '❌ This modal is invalid.', ephemeral: true });
                }

                await modal.execute(interaction);
            }
        } catch (error) {
            console.error(`Error handling interaction:`, error);

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: '❌ An unexpected error occurred. Please try again later.', ephemeral: true });
                } else {
                    await interaction.reply({ content: '❌ An unexpected error occurred. Please try again later.', ephemeral: true });
                }
            } catch (err) {
                console.error('Failed to send error message:', err);
            }
        }
    },
};
