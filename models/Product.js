const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  guildId: {
    type: String,
    required: true
  },

  productId: {
    type: Number,
    required: true
  },

  name: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model(
  'Product',
  productSchema
);