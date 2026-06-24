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
      status:
        client.ws.status,
      ping:
        client.ws.ping
    });

  }
);

module.exports =
  router;