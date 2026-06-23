const express = require('express');
const axios = require('axios');

const VerifiedUser = require('../models/VerifiedUser');
const VerifyConfig = require('../models/VerifyConfig');

const router = express.Router();

router.get('/', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send('No OAuth code provided.');
  }

  try {
    const tokenResponse = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.REDIRECT_URI
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get(
      'https://discord.com/api/users/@me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const user = userResponse.data;
    const guildId = req.query.state;

    await VerifiedUser.findOneAndUpdate(
      {
        guildId,
        userId: user.id
      },
      {
        username: user.username,
        verifiedAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    const config = await VerifyConfig.findOne({
      guildId
    });

    if (config) {
      const guild = await global.client.guilds.fetch(
        guildId
      );

      const member = await guild.members.fetch(
        user.id
      );

      await member.roles.add(
        config.roleId
      );
    }

    return res.send(`
      <html>
      <body style="
        font-family:sans-serif;
        background:#0f172a;
        color:white;
        text-align:center;
        padding:50px;
      ">
        <h1>✅ Verification Success</h1>

        <img
          src="https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png"
          width="100"
          style="border-radius:50%"
        />

        <h2>${user.username}</h2>

        <p>
          Your Discord account has been authenticated.
        </p>

      </body>
      </html>
    `);

  } catch (err) {

    console.error(
      err.response?.data || err
    );

    return res.status(500).send(`
      <h1>❌ Verification Failed</h1>
    `);

  }
});

module.exports = router;