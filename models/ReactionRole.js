const mongoose = require('mongoose');

module.exports = mongoose.model(
  'ReactionRole',
  new mongoose.Schema({
    guildId: String,
    channelId: String,
    messageId: String,
    emoji: String,
    roleId: String
  })
);