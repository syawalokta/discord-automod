const express = require('express');

const router =
  express.Router();

router.get(
  '/',
  async (req, res) => {

    const client =
      global.client;

    const servers =
      client.guilds.cache.size;

    const users =
      client.guilds.cache.reduce(
        (total, guild) =>
          total +
          guild.memberCount,
        0
      );

    res.json({
      success: true,
      servers,
      users
    });

  }
);

module.exports =
  router;