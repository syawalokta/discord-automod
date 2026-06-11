require('dotenv').config();
const fs = require('fs');
const { REST, Routes } = require('discord.js');

const commands = [];
const ds = './commands';

fs.readdirSync(ds).forEach(dir => {
  const commandFiles = fs.readdirSync(`${ds}/${dir}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${ds}/${dir}/${file}`);
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
});

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔁 Deploying slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Successfully deployed slash commands!');
  } catch (error) {
    console.error('❌ Failed to deploy commands:', error);
  }
})();
