const express = require('express');

const router =
  express.Router();

router.get(
  '/',
  async (req, res) => {

    const client =
      global.client;

    res.json({
      success: true,

      username:
        client.user.username,

      id:
        client.user.id,

      avatar:
        client.user.displayAvatarURL(),

      guilds:
        client.guilds.cache.size

    });

  }
);

module.exports =
  router;