const mongoose = require('mongoose');

const storeConfigSchema = new mongoose.Schema({

  guildId: {
    type: String,
    required: true,
    unique: true
  },

  channelId: {
    type: String,
    required: true
  },

  messageId: {
    type: String,
    default: null
  },

  panelMessage: {
    type: String,
    default: null
  }

});

module.exports = mongoose.model(
  'StoreConfig',
  storeConfigSchema
);