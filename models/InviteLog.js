const mongoose = require('mongoose');

const inviteLogSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },

  channelId: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model(
  'InviteLog',
  inviteLogSchema
);