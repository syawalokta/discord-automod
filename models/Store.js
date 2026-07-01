const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({

  guildId: {
    type: String,
    required: true,
    index: true
  },

  channelId: {
    type: String,
    required: true,
    unique: true
  },

  messageId: {
    type: String,
    default: null
  },

  title: {
    type: String,
    default: '📦 Store'
  },

  description: {
    type: String,
    default: 'Pilih produk melalui menu di bawah.'
  },

  image: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  'Store',
  storeSchema
);