require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const deploy = require ('./deploy-commands.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember],
});

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(dir => {
  const commandFiles = fs.readdirSync(path.join(commandsPath, dir)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, dir, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
});

// Status event
client.once('clientReady', () => {
  console.log(`✅ Bot ready as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'your server 👀', type: 3 }],
    status: 'online'
  });
});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
  client.login(process.env.DISCORD_TOKEN);
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Event loader
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

// KeepAlive server for Replit
const app = express();
app.get('/', (req, res) => {
  res.send('Bot is alive!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[+] KeepAlive server running on port ${PORT}`);
});

// Error catcher
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});
