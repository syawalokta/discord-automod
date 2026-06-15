const mongoose = require('mongoose');

module.exports = mongoose.model(
  'VoiceStay',
  new mongoose.Schema({
    guildId: {
      type: String,
      required: true,
      unique: true
    },

    channelId: {
      type: String,
      required: true
    }
  })
);