require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const User = require('./models/User');

// api
const statsApi = require('./api/stats');
const statusApi = require('./api/status');
const botApi = require('./api/bot');

const authRoute = require('./routes/auth');
const callbackRoute = require('./routes/callback');

const app = express();

app.use('/auth', authRoute);
app.use('/callback', callbackRoute);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,

    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction],
});

global.client = client;

client.commands = new Collection();
client.selectMenus = new Collection();
client.invites = new Collection();

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
client.once('clientReady', async () => {

  console.log(
    `✅ Bot ready as ${client.user.tag}`
  );

  client.user.setPresence({
    activities: [
      {
        name: 'your server 👀',
        type: 3
      }
    ],
    status: 'online'
  });

  try {

    for (const guild of client.guilds.cache.values()) {

      const invites =
        await guild.invites.fetch();

      client.invites.set(
        guild.id,
        new Map(
          invites.map(inv => [
            inv.code,
            inv.uses
          ])
        )
      );

      console.log(
        `📨 Cached ${invites.size} invites for ${guild.name}`
      );

    }

  } catch (err) {

    console.error(
      '[Invite Cache]',
      err
    );

  }

});


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {

  console.log('✅ Connected to MongoDB');

  setInterval(async () => {

    try {

      const expiredUsers =
        await User.find({
          role: 'premium',
          premiumUntil: {
            $ne: null,
            $lt: new Date()
          }
        });

      for (const user of expiredUsers) {

        user.role = 'user';
        user.premiumUntil = null;

        await user.save();

        console.log(
          `⭐ Premium expired: ${user.userId}`
        );

        try {

          const discordUser =
            await client.users.fetch(
              user.userId
            );

          await discordUser.send({
            embeds: [
              {
                title:
                  '⭐ Premium Expired',
                description:
                  'Masa aktif premium kamu telah berakhir.\n\nSilakan perpanjang premium untuk kembali menggunakan fitur premium.',
                color:
                  0xED4245,
                timestamp:
                  new Date()
              }
            ]
          });

        } catch (err) {}

      }

    } catch (err) {

      console.error(
        '[Premium Expire]',
        err
      );

    }

  }, 60 * 1000);

  client.login(
    process.env.DISCORD_TOKEN
  );

}).catch(err => {

  console.error(
    '❌ MongoDB connection error:',
    err
  );

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

// Component
const selectPath =
  path.join(
    __dirname,
    'components',
    'selectMenus'
  );

if (fs.existsSync(selectPath)) {

  const files =
    fs.readdirSync(selectPath)
      .filter(file =>
        file.endsWith('.js')
      );

  for (const file of files) {

    const menu =
      require(
        path.join(
          selectPath,
          file
        )
      );

    client.selectMenus.set(
      menu.customId,
      menu
    );

  }

}

// KeepAlive server for Replit
app.use(
  express.static(
    path.join(
      __dirname,
      'public'
    )
  )
);

app.get('/', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      'views',
      'index.html'
    )
  );
});

app.use(
  '/api/stats',
  statsApi
);

app.use(
  '/api/status',
  statusApi
);

app.use(
  '/api/bot',
  botApi
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[+] KeepAlive server running on port ${PORT}`);
});

// Error catcher
process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});
