const mongoose = require('mongoose');

const inviteStatsSchema =
  new mongoose.Schema({

    guildId: String,

    userId: String,

    invites: {
      type: Number,
      default: 0
    }

  });

module.exports =
  mongoose.model(
    'InviteStats',
    inviteStatsSchema
  );