const express = require('express');

const router = express.Router();

router.get('/:guildId', (req, res) => {

  const guildId = req.params.guildId;

  const url =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${process.env.CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify` +
    `&state=${guildId}`;

  res.redirect(url);
});

module.exports = router;